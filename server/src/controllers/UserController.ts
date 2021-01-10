import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import * as rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';
import * as jsonwebtoken from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { jwtSecret } from '../secrets';
import { emailFrom, resetEmail, resetHTML, saltRounds, verifyEmail, verifyHTML } from '../utils/config';
import { ajv, dynamo, IS_DEV, limitStore } from '../utils/constants';


const sendVerifyEmail = async (email: string, secret: string, host: string) => {
    try {
        const pkg = {
            email,
            secretKey: secret
        };
        const jsonB64 = Buffer.from(JSON.stringify(pkg)).toString('base64');
        if (!IS_DEV) {
            const smtpTransport = nodemailer.createTransport({ SES: new AWS.SES() });
            const mailOptions: Mail.Options = {
                to: email,
                from: emailFrom,
                subject: 'Verify your UofTea account now! 🔫',
                text: verifyEmail.replace(/{{host}}/g, host).replace(/{{jsonB64}}/g, jsonB64),
                html: verifyHTML.replace(/{{host}}/g, host).replace(/{{jsonB64}}/g, jsonB64),
            };
            smtpTransport.sendMail(mailOptions, (err: Error | null) => {
                if (err) {
                    Logger.Err(err, true);
                }
            });
        } else {
            Logger.Info('URL Created: ' + 'https://' + host + '/verify/' + jsonB64);
        }

    } catch (err) {
        Logger.Err(err, true);
    }
}


@Controller('api/user')
class UserController {

    @Get('validateJWT')
    public validateJWT(req: Request, res: Response) {
        try {
            const decoded = jsonwebtoken.verify(req.signedCookies.token, jwtSecret);
            const user = (decoded as { username: string }).username;
            return res.status(StatusCodes.OK).send(user);
        } catch (err) {
            return res.clearCookie('token').status(StatusCodes.UNAUTHORIZED).send(err.message);
        }
    }

    @Get('logout')
    public logout(_req: Request, res: Response) {
        try {
            return res.clearCookie('token').send('Logged out successfully');
        } catch (err) {
            Logger.Err(err, true);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    }

    @Post('register')
    @Middleware(rateLimit({
        store: limitStore,
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10,// limit each IP to 5 requests per windowMs,
        message: 'Too many accounts created from this IP, please try again after 5 minutes',
        keyGenerator: (req) => (req as any).fingerprint?.hash || req.ip
    }))
    public async register(req: Request, res: Response) {
        try {
            const schema = {
                properties: {
                    email: {
                        type: 'string',
                    },
                    password: {
                        type: 'string'
                    },
                    username: {
                        type: 'string',
                        pattern: '[a-zA-Z0-9]{4,12}'
                    }
                },
                required: ['email', 'password', 'username']
            };
            const valid = ajv.validate(schema, req.body);
            if (!valid) {
                Logger.Err(ajv.errors);
                return res.status(StatusCodes.BAD_REQUEST).send(ajv.errors);
            }
            const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!emailRegex.test(req.body.email)) {
                return res.status(StatusCodes.BAD_REQUEST).send({ err: 'Bad Email' });
            }
            const { thisiscuzimangry } = req.headers;
            if (thisiscuzimangry as string !== 'funny Haha') {
                throw new Error('Not funny, didn\'t laugh');
            }
            const { email, password, username } = req.body;
            const getParam: DocumentClient.GetItemInput = {
                TableName: 'UserInfo',
                Key: { username }
            };
            const data = await dynamo.get(getParam).promise();
            if (data.Item) {
                return res.status(StatusCodes.CONFLICT).send('Specified username already exists');
            }
            const hash = bcrypt.hashSync(password, saltRounds);
            const secretKey = Math.random().toString(36).substring(2, 15);
            const putParam: DocumentClient.PutItemInput = {
                TableName: 'UserCredentials',
                Item: {
                    email: email.toLowerCase(),
                    password: hash,
                    created: Date.now(),
                    username,
                    secretKey,
                },
                ConditionExpression: 'attribute_not_exists(email)'
            }
            await dynamo.put(putParam).promise();
            const putInfoParam: DocumentClient.PutItemInput = {
                TableName: 'UserInfo',
                Item: {
                    username,
                    verified: false,
                    isUofT: false,
                    darkmode: false,
                }
            }
            await dynamo.put(putInfoParam).promise();
            const token = jsonwebtoken.sign({
                email: email.toLowerCase(),
                username,
                verified: false,
                iat: Math.floor(Date.now() / 1000)
            }, jwtSecret);
            res.status(StatusCodes.OK).cookie('token', token, {
                httpOnly: true,
                signed: true,
                maxAge: 60 * 60 * 24 * 365 * 1000
            }).send('Created account successfully');
            sendVerifyEmail(email.toLowerCase(), secretKey, req.headers.host as string);
        } catch (err) {
            if (err.code === 'ConditionalCheckFailedException') {
                Logger.Info(`User already exists`)
                return res.status(StatusCodes.CONFLICT).send('User already exists');
            } else {
                Logger.Err(err, true);
                return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send(err.message || err);
            }
        }
    }



    @Get('verify/:b64Json')
    @Middleware(rateLimit({
        store: limitStore,
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // limit each IP to 5 requests per windowMs
        keyGenerator: (req) => new Buffer(req.params.b64Json, 'base64').toString()
    }))
    public async verifyUser(req: Request, res: Response) {
        try {
            const json = JSON.parse(new Buffer(req.params.b64Json, 'base64').toString()); // should fix this deprecation bit
            const schema = {
                properties: {
                    email: {
                        type: 'string',
                    },
                    secretKey: { 'type': 'string' }
                },
                required: ['email', 'secretKey']
            };
            const valid = ajv.validate(schema, json);
            if (!valid) {
                Logger.Err(ajv.errors);
                return res.status(StatusCodes.BAD_REQUEST).send(ajv.errors);
            }
            const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!emailRegex.test(json.email)) {
                return res.status(StatusCodes.BAD_REQUEST).send({ err: 'Bad Email' });
            }
            const { email, secretKey } = json;
            const updateParam = {
                TableName: 'UserCredentials',
                Key: {
                    email: email.toLowerCase()
                },
                UpdateExpression: 'REMOVE secretKey',
                ConditionExpression: 'secretKey= :target',
                ExpressionAttributeValues: {
                    ':target': secretKey
                },
                ReturnValues: 'ALL_NEW'
            };
            const updated = (await dynamo.update(updateParam).promise()).Attributes;
            if (updated && updated.username && updated.email) {
                const updateInfoParam = {
                    TableName: 'UserInfo',
                    Key: {
                        'username': updated.username.toString()
                    },
                    UpdateExpression: 'SET verified = :status, isUofT = :uoft',
                    ExpressionAttributeValues: {
                        ':status': true,
                        ':uoft': updated.email.includes('utoronto.ca')
                    }
                };
                await dynamo.update(updateInfoParam).promise();
            }
            if (req.signedCookies.token) {
                try {
                    const decoded = jsonwebtoken.verify(req.signedCookies.token, jwtSecret);
                    const token = jsonwebtoken.sign({
                        email: email.toLowerCase(),
                        username: (decoded as { username: string }).username,
                        verified: true,
                        iat: Math.floor(Date.now() / 1000)
                    }, jwtSecret);
                    res.status(StatusCodes.OK).cookie('token', token, {
                        httpOnly: true,
                        signed: true,
                        maxAge: 60 * 60 * 24 * 365 * 1000
                    }).send('You have been verified successfully');
                } catch (e) {
                    res.status(StatusCodes.OK).send('You have been verified successfully');
                }
            } else {
                res.status(StatusCodes.OK).send('You have been verified successfully');
            }
        } catch (err) {
            Logger.Err(err, true);
            return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send(err.message || err);
        }
    }

    @Post('login')
    public async login(req: Request, res: Response) {
        try {
            const schema = {
                properties: {
                    email: {
                        type: 'string',
                    },
                    password: {
                        type: 'string'
                    }
                },
                required: ['email', 'password']
            };
            const valid = ajv.validate(schema, req.body);
            if (!valid) {
                Logger.Err(ajv.errors);
                return res.status(StatusCodes.BAD_REQUEST).send(ajv.errors);
            }
            const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!emailRegex.test(req.body.email)) {
                return res.status(StatusCodes.BAD_REQUEST).send({ err: 'Bad Email' });
            }
            const { email, password } = req.body;
            const dynamoGetParams = {
                TableName: 'UserCredentials',
                Key: {
                    email: email.toLowerCase()
                },

            };

            const userInfo = (await dynamo.get(dynamoGetParams).promise()).Item;
            if (!userInfo) {
                return res.status(StatusCodes.NOT_FOUND).send('User does not exist');
            }
            const matches = bcrypt.compareSync(password, userInfo.password);
            if (!matches) {
                return res.status(StatusCodes.FORBIDDEN).send('Passwords does not match');
            }

            const getParam = {
                TableName: 'UserInfo',
                Key: {
                    username: userInfo.username
                }
            };
            const data = await dynamo.get(getParam).promise();
            const token = jsonwebtoken.sign({
                email: email.toLowerCase(),
                username: userInfo.username,
                verified: data.Item?.verified || false,
                iat: Math.floor(Date.now() / 1000)
            }, jwtSecret);

            // Give them that sweet sweet JWT goodness dog

            return res.status(StatusCodes.OK).
                cookie('token', token, {
                    httpOnly: true,
                    signed: true,
                    maxAge: 60 * 60 * 24 * 365 * 1000
                }).send(userInfo.username);
        } catch (err) {
            Logger.Err(err, true);
            return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send(err.message || err);
        }
    }


    @Post('forgot')
    @Middleware(rateLimit({
        store: limitStore,
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5,// limit each IP to 1 requests per windowMs
        keyGenerator: (req) => (req as any).fingerprint?.hash || req.ip
    }))
    public async forgotPasswordRequest(req: Request, res: Response) {
        try {
            const url = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const schema = {
                properties: {
                    email: {
                        type: 'string',
                    }
                },
                required: ['email']
            };
            const valid = ajv.validate(schema, req.body);
            if (!valid) {
                Logger.Err(ajv.errors);
                return res.status(StatusCodes.BAD_REQUEST).send(ajv.errors);
            }
            const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!emailRegex.test(req.body.email)) {
                return res.status(StatusCodes.BAD_REQUEST).send({ err: 'Bad Email' });
            }
            const { email } = req.body;
            const updateParam: DocumentClient.UpdateItemInput = {
                TableName: 'UserCredentials',
                Key: {
                    email: email.toLowerCase()
                },
                UpdateExpression: 'SET rUrl= :url, passwordResetExp= :passwordReset',
                ExpressionAttributeValues: {
                    ':url': url,
                    ':passwordReset': Date.now() + 3600000
                }
            };
            Logger.Info('User with email ' + email + ' requested password reset');
            await dynamo.update(updateParam).promise();
            if (!IS_DEV) {
                const smtpTransport = nodemailer.createTransport({ SES: new AWS.SES() });
                const mailOptions: Mail.Options = {
                    to: email.toLowerCase(),
                    from: emailFrom,
                    subject: 'UofTea Password Reset',
                    text: resetEmail.replace(/{{host}}/g, req.headers.host as string).replace(/{{url}}/g, url),
                    html: resetHTML.replace(/{{host}}/g, req.headers.host as string).replace(/{{url}}/g, url),
                };
                await smtpTransport.sendMail(mailOptions);
            } else {
                Logger.Info('Created forgot password url: ' + 'http://{{host}}/reset/{{url}}'.
                    replace('{{host}}', req.headers.host as string).replace('{{url}}', url));
            }
            return res.status(StatusCodes.OK).send('Password reset link should be sent');

        } catch (err) {
            Logger.Err(err, true);
            return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send(err.message || err);
        }

    }

    @Post('resetPassword')
    @Middleware(rateLimit({
        store: limitStore,
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // limit each IP to 5 requests per windowMs
        keyGenerator: (req) => (req as any).fingerprint?.hash || req.ip
    }))
    public async resetPassword(req: Request, res: Response) {
        try {
            const schema = {
                properties: {
                    token: {
                        type: 'string',
                        minLength: 21,
                        maxLength: 23
                    },
                    password: {
                        type: 'string'
                    }
                },
                required: ['token', 'password']
            };
            const valid = ajv.validate(schema, req.body);
            if (!valid) {
                Logger.Err(ajv.errors);
                return res.status(StatusCodes.BAD_REQUEST).send(ajv.errors);
            }
            const { token, password } = req.body;
            const hash = bcrypt.hashSync(password, saltRounds);
            // First we need to find which token this reset is associated with
            const queryParam: DocumentClient.QueryInput = {
                TableName: 'UserCredentials',
                KeyConditionExpression: 'rUrl = :token',
                IndexName: 'ResetURL',
                ExpressionAttributeValues: {
                    ':token': token
                },
                ProjectionExpression: ['email', 'passwordResetExp'].toLocaleString()
            };
            const items = (await dynamo.query(queryParam).promise()).Items;
            // If we get this, the entry is not found, or we just crashed idk
            if (!items || items.length === 0) {
                return res.status(StatusCodes.NOT_FOUND).send('Could not find the requested reset');
            }

            const email = items[0].email.toLowerCase();
            const expiry = items[0].passwordResetExp;
            const updateParam: DocumentClient.UpdateItemInput = {
                TableName: 'UserCredentials',
                Key: {
                    email
                },
                UpdateExpression: ''
            };
            let statusCode = StatusCodes.OK;
            let resp = '';
            if (Date.now() > expiry) {
                // If it expired, we delete it
                updateParam.UpdateExpression = 'REMOVE rUrl, passwordResetExp'
                statusCode = StatusCodes.BAD_REQUEST;
                resp = 'The password reset request could not be fulfilled, the url has expired please try again later';
            } else {
                updateParam.UpdateExpression = 'SET password= :newPassword REMOVE rUrl, passwordResetExp';
                updateParam.ExpressionAttributeValues = {
                    ':newPassword': hash
                }
                statusCode = StatusCodes.OK;
                resp = 'Password reset successfully';
            }

            await dynamo.update(updateParam).promise();
            return res.status(statusCode).send(resp);

        } catch (err) {
            Logger.Err(err, true);
            return res.status(err.statusCode || StatusCodes.SERVICE_UNAVAILABLE).send(err.message || err);
        }
    }

    @Post('darkmode')
    public async darkmode(req: Request, res: Response) {
        let username;
        try {
            const decoded = jsonwebtoken.verify(req.signedCookies.token, jwtSecret);
            username = (decoded as { username: string }).username;

        } catch (jwtErr) {
            return res.status(StatusCodes.UNAUTHORIZED).send(jwtErr.message);
        }
        if (!username) {
            return res.status(StatusCodes.UNAUTHORIZED).send();
        }
        try {
            const schema = {
                properties: {
                    darkmode: { type: 'boolean' },
                },
                required: ['darkmode']
            };
            const valid = ajv.validate(schema, req.body);
            if (!valid) {
                Logger.Err(ajv.errors);
                return res.status(StatusCodes.BAD_REQUEST).send(ajv.errors);
            }
            const { darkmode } = req.body;
            const updateParam: DocumentClient.UpdateItemInput = {
                TableName: 'UserInfo',
                Key: {
                    username
                },
                UpdateExpression: 'SET darkmode= :darkmode',
                ExpressionAttributeValues: {
                    ':darkmode': darkmode
                }
            };
            await dynamo.update(updateParam).promise();
            return res.status(StatusCodes.OK).send('Darkmode status updated');

        } catch (err) {
            Logger.Err(err, true);
            return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send(err.message || err);
        }
    }

    @Get('darkmode')
    public async darkmodeStatus(req: Request, res: Response) {
        let username;
        try {
            const decoded = jsonwebtoken.verify(req.signedCookies.token, jwtSecret);
            username = (decoded as { username: string }).username;
        } catch (jwtErr) {
            return res.status(StatusCodes.UNAUTHORIZED).send(jwtErr.message);
        }
        if (!username) {
            return res.status(StatusCodes.UNAUTHORIZED).send();
        }
        try {
            const getParam = {
                TableName: 'UserInfo',
                Key: {
                    username
                }
            };
            const data = await dynamo.get(getParam).promise();
            if (!data.Item) {
                return res.status(StatusCodes.NOT_FOUND).send('User not found');
            }
            const { darkmode } = data.Item;
            return res.status(StatusCodes.OK).send({
                darkmode
            });

        } catch (err) {
            Logger.Err(err, true);
            return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send(err.message || err);

        }
    }
}

export default UserController;