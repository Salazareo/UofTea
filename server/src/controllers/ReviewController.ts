import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Key } from 'aws-sdk/clients/dynamodb';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { Request, Response } from 'express';
import * as rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';
import * as jsonwebtoken from 'jsonwebtoken';
import { jwtSecret } from '../secrets';
import { courseReviewReplace, profReviewReplace } from '../utils/config';
import { dynamo, IS_DEV, limitStore } from '../utils/constants';

export interface Ratings {
    difficulty: number;
    recommended: number;
    useful: number;
    interesting: number;
    workload: number;
}

export interface ProfRatings {
    recommended: number;
    clarity: number;
    engaging: number;
}

@Controller('api/reviews')
class ReviewController {

    @Get('course/:courseCode')
    public async getReviews(req: Request, res: Response) {
        try {
            const { courseCode } = req.params;
            const { ascending, lastItem } = req.query;
            const queryParam: DocumentClient.QueryInput = {
                TableName: 'CourseReviews',
                KeyConditionExpression: 'courseCode = :code',
                ExpressionAttributeValues: {
                    ':code': courseCode.toLowerCase()
                },
                Limit: 4,
                ScanIndexForward: ascending === 'true'
            }
            if (lastItem) {
                queryParam.ExclusiveStartKey = JSON.parse(lastItem as string) as Key;
            }
            const out = await dynamo.query(queryParam).promise();
            if (out.Items && out.Items.length > 0) {
                const userBatchGetParams: DocumentClient.BatchGetItemInput = {
                    RequestItems: {
                        UserInfo: {
                            Keys: []
                        }
                    }
                }
                const addedUser = new Set<string>();
                out.Items.forEach((item) => {
                    if (!addedUser.has(item.user)) {
                        userBatchGetParams.RequestItems.UserInfo.Keys.push({ username: item.user });
                        addedUser.add(item.user);
                    }
                });
                const usersVerification = (await dynamo.batchGet(userBatchGetParams).promise()).Responses!.UserInfo;
                for (const userVer of usersVerification) {
                    for (const item of out.Items) {
                        if (item.user === userVer.username) {
                            item.isUofT = userVer.isUofT
                        }
                    }
                }
                return res.status(StatusCodes.OK).send({ items: out.Items, more: out.LastEvaluatedKey ? true : false });
            }
            else {
                return res.status(StatusCodes.NOT_FOUND).send({ items: [], more: false })
            }
        } catch (err) {
            Logger.Err(err, true);
            return res.status(err.statusCode || StatusCodes.SERVICE_UNAVAILABLE).send(err.message || err.toString());
        }
    }

    @Post('leave/course/:courseCode')
    @Middleware(rateLimit({
        store: limitStore,
        windowMs: 300 * 60 * 1000, // 15 minutes
        max: 10,// limit each IP to 5 requests per windowMs,
        message: 'Too many reviews made from this user, please try again after 300 minutes',
        keyGenerator: (req) => {
            try {
                return (jsonwebtoken.verify(req.signedCookies.token, jwtSecret) as { username: string }).username;
            } catch (e) {
                return req.ip;
            }
        }
    }))
    public async leaveReview(req: Request, res: Response) {
        try {
            const { courseCode } = req.params;
            const { ratings, review, prof } = req.body;
            if (!prof || !courseCode || !review || !ratings) {
                return res.status(StatusCodes.BAD_REQUEST).send();
            }
            let user;
            let verified;
            try {
                const decoded = jsonwebtoken.verify(req.signedCookies.token, jwtSecret);
                user = (decoded as { username: string }).username;
                verified = (decoded as { verified: boolean }).verified;
            } catch (jwtErr) {
                return res.status(StatusCodes.UNAUTHORIZED).send(jwtErr.message);
            }
            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).send();
            }
            if (!verified && !IS_DEV) {
                return res.status(StatusCodes.UNAUTHORIZED).send('Please verify your account before leaving reviews');
            }
            const getParam = {
                TableName: 'UserInfo',
                Key: {
                    username: user
                }
            };
            const userInfo = await dynamo.get(getParam).promise();
            if (!userInfo.Item?.verified && !IS_DEV) {
                return res.status(StatusCodes.UNAUTHORIZED).send('Please verify your account before leaving reviews');
            }

            const queryParam: DocumentClient.QueryInput = {
                TableName: 'CourseReviews',
                IndexName: 'userIndex',
                KeyConditionExpression: '#username = :username AND courseCode = :courseCode',
                ExpressionAttributeValues: {
                    ':username': user,
                    ':courseCode': courseCode.toLowerCase()
                },
                ExpressionAttributeNames: {
                    '#username': 'user',
                }
            };
            const reviewTime = Date.now();
            const updateDate = new Date();
            let isUpdate = false;
            updateDate.setMonth(updateDate.getMonth() - courseReviewReplace);
            const dynamoUpdateParams: DocumentClient.UpdateItemInput = {
                TableName: 'CourseReviews',
                Key: {
                    courseCode: courseCode.toLowerCase(),
                    time: reviewTime
                },
                UpdateExpression: 'set #userName = :userName, ratings = :ratings, review = :review, prof = :prof',
                ExpressionAttributeNames: {
                    '#userName': 'user',
                },
                ExpressionAttributeValues: {
                    ':userName': user,
                    ':prof': prof.toLowerCase(),
                    ':ratings': ratings,
                    ':review': review
                }
            } as DocumentClient.UpdateItemInput;
            const items = (await dynamo.query(queryParam).promise()).Items;
            let oldRating: any = {};
            if (items && items.length > 0) {
                for (const item of items) {
                    const oldPost = new Date(item.time);
                    oldPost.setMonth(oldPost.getMonth() + courseReviewReplace);
                    if (Date.now() < oldPost.getTime() && item.prof === prof.toLowerCase()) {
                        isUpdate = true;
                        oldRating = item.ratings;
                        dynamoUpdateParams.Key.time = item.time;
                        // if we are in this state, that means we are replacing an old review rather then putting in a new one
                        // time for some ass math ngl
                        dynamoUpdateParams.ConditionExpression = 'courseCode = :courseCode AND #userName = :userName AND prof = :prof';
                        dynamoUpdateParams.ExpressionAttributeValues![':courseCode'] = courseCode.toLowerCase();
                        break;
                    }
                }
            }
            await dynamo.update(dynamoUpdateParams).promise();

            const subject = courseCode.substring(0, 3).toLowerCase();
            const identifier = courseCode.substring(3).toLowerCase();

            const dynamoGetParams = {
                TableName: 'CourseInfo',
                Key: {
                    subject,
                    identifier
                },
            }
            const data = (await dynamo.get(dynamoGetParams).promise()).Item;

            const updateRatings = {
                difficulty: { avg: 0, total: 0 },
                recommended: { avg: 0, total: 0 },
                useful: { avg: 0, total: 0 },
                interesting: { avg: 0, total: 0 },
                workload: { avg: 0, total: 0 },
            } as any;
            if (data) {
                for (const name in data.ratings) {
                    if (data.ratings.hasOwnProperty(name)) {
                        const { avg, total } = data.ratings[name];
                        if (isUpdate) {
                            updateRatings[name].avg = (avg * total - oldRating[name] + ratings[name]) / total;
                        } else {
                            updateRatings[name].avg = (avg * total + ratings[name]) / (total + 1);
                            updateRatings[name].total = total + 1;
                        }
                    }
                }
            }
            const dynamoUpdateReview: DocumentClient.UpdateItemInput = {
                TableName: 'CourseInfo',
                Key: {
                    subject,
                    identifier
                },
                UpdateExpression: 'set ratings = :r',
                ExpressionAttributeValues: {
                    ':r': updateRatings,
                },
            };
            const succ = await dynamo.update(dynamoUpdateReview).promise();
            res.status(StatusCodes.OK).send(succ);

        } catch (err) {
            Logger.Err(err, true);
            return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err.toString());
        }
    }

    @Get('professor/:profName')
    public async getProfReviews(req: Request, res: Response) {
        try {
            const { profName } = req.params;
            const { ascending, lastItem } = req.query;
            const queryParam: DocumentClient.QueryInput = {
                TableName: 'ProfessorReviews',
                KeyConditionExpression: 'professor = :name',
                ExpressionAttributeValues: {
                    ':name': profName.replace(/\%20/g, ' ').toLowerCase().trim()
                },
                Limit: 4,
                ScanIndexForward: ascending === 'true'
            }
            if (lastItem) {
                queryParam.ExclusiveStartKey = JSON.parse(lastItem as string) as Key;
            }
            const out = await dynamo.query(queryParam).promise();
            if (out.Items && out.Items.length > 0) {
                const userBatchGetParams: DocumentClient.BatchGetItemInput = {
                    RequestItems: {
                        UserInfo: {
                            Keys: []
                        }
                    }
                }
                const addedUser = new Set<string>();
                out.Items.forEach((item) => {
                    if (!addedUser.has(item.user)) {
                        userBatchGetParams.RequestItems.UserInfo.Keys.push({ username: item.user });
                        addedUser.add(item.user);
                    }
                });
                const usersVerification = (await dynamo.batchGet(userBatchGetParams).promise()).Responses!.UserInfo;
                for (const userVer of usersVerification) {
                    for (const item of out.Items) {
                        if (item.user === userVer.username) {
                            item.isUofT = userVer.isUofT
                        }
                    }
                }
                return res.status(StatusCodes.OK).send({ items: out.Items, more: out.LastEvaluatedKey ? true : false });
            }
            else {
                return res.status(StatusCodes.NOT_FOUND).send({ items: [], more: false })
            }

        } catch (err) {
            Logger.Err(err, true);
            return res.status(err.statusCode || StatusCodes.SERVICE_UNAVAILABLE).send(err.message || err.toString());
        }
    }

    @Post('leave/professor/:profName')
    @Middleware(rateLimit({
        store: limitStore,
        windowMs: 300 * 60 * 1000, // 15 minutes
        max: 10,// limit each IP to 5 requests per windowMs,
        message: 'Too many reviews made from this user, please try again after 300 minutes',
        keyGenerator: (req) => {
            try {
                return (jsonwebtoken.verify(req.signedCookies.token, jwtSecret) as { username: string }).username;
            } catch (e) {
                return req.ip;
            }
        }
    }))
    public async leaveProfReview(req: Request, res: Response) {
        try {
            const { profName } = req.params;
            const { ratings, review, course } = req.body;
            if (!profName || !review || !ratings) {
                return res.status(StatusCodes.BAD_REQUEST).send();
            }
            let user;
            let verified;
            try {
                const decoded = jsonwebtoken.verify(req.signedCookies.token, jwtSecret);
                user = (decoded as { username: string }).username;
                verified = (decoded as { verified: boolean }).verified;
            } catch (jwtErr) {
                return res.status(StatusCodes.UNAUTHORIZED).send(jwtErr.message);
            }
            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).send();
            }
            if (!verified && !IS_DEV) {
                return res.status(StatusCodes.UNAUTHORIZED).send('Please verify your account before leaving reviews');
            }
            const getParam = {
                TableName: 'UserInfo',
                Key: {
                    username: user
                }
            };
            const userInfo = await dynamo.get(getParam).promise();
            if (!userInfo.Item?.verified && !IS_DEV) {
                return res.status(StatusCodes.UNAUTHORIZED).send('Please verify your account before leaving reviews');
            }

            const queryParam: DocumentClient.QueryInput = {
                TableName: 'ProfessorReviews',
                IndexName: 'userIndex',
                KeyConditionExpression: '#username = :username AND professor = :professor',
                ExpressionAttributeValues: {
                    ':username': user,
                    ':professor': profName.replace(/%20/g, ' ').toLowerCase()
                },
                ExpressionAttributeNames: {
                    '#username': 'user'
                }
            };
            const reviewTime = Date.now();
            let isUpdate = false;
            const dynamoUpdateParams: DocumentClient.UpdateItemInput = {
                TableName: 'ProfessorReviews',
                Key: {
                    professor: profName.replace(/%20/g, ' ').toLowerCase(),
                    time: reviewTime
                },
                UpdateExpression: 'set #userName = :userName, ratings = :ratings, review = :review, course = :course',
                ExpressionAttributeNames: {
                    '#userName': 'user',
                },
                ExpressionAttributeValues: {
                    ':userName': user,
                    ':ratings': ratings,
                    ':review': review,
                    ':course': course.toLowerCase()
                }
            };
            const items = (await dynamo.query(queryParam).promise()).Items;
            let oldRating: any = {};
            if (items && items.length > 0) {
                for (const item of items) {
                    const oldPost = new Date(item.time);
                    oldPost.setMonth(oldPost.getMonth() + profReviewReplace);
                    if (reviewTime <= oldPost.getTime() && item.course === course.toLowerCase()) {
                        isUpdate = true;
                        oldRating = item.ratings;
                        dynamoUpdateParams.Key.time = item.time;
                        dynamoUpdateParams.ConditionExpression = 'course = :course AND #userName = :userName AND professor = :prof';
                        dynamoUpdateParams.ExpressionAttributeValues![':course'] = course.toLowerCase();
                        dynamoUpdateParams.ExpressionAttributeValues![':prof'] = profName.replace(/%20/g, ' ').toLowerCase();
                        break;
                    }
                }
            }
            await dynamo.update(dynamoUpdateParams).promise();
            const professor = profName.toLowerCase().replace(/\%20/g, ' ').trim();
            const dynamoGetParams = {
                TableName: 'ProfessorInfo',
                Key: {
                    professor
                }
            };
            const updateRatings = {
                recommended: { avg: ratings.recommended, total: 1 },
                clarity: { avg: ratings.clarity, total: 1 },
                engaging: { avg: ratings.engaging, total: 1 },
            } as any;
            const profItems = (await dynamo.get(dynamoGetParams).promise()).Item;
            if (profItems) {
                for (const name in profItems.ratings) {
                    if (profItems.ratings.hasOwnProperty(name)) {
                        const { avg, total } = profItems.ratings[name];
                        if (isUpdate) {
                            updateRatings[name].avg = (updateRatings[name].avg - oldRating[name] + avg * total) / total;
                        } else {
                            updateRatings[name].avg = (updateRatings[name].avg + avg * total) / (total + 1);
                            updateRatings[name].total = total + 1;
                        }

                    }
                }
            }
            const dynamoUpdateReview: DocumentClient.UpdateItemInput = {
                TableName: 'ProfessorInfo',
                Key: {
                    professor
                },
                UpdateExpression: 'set ratings = :r',
                ExpressionAttributeValues: {
                    ':r': updateRatings,
                }
            }
            const succ = await dynamo.update(dynamoUpdateReview).promise();
            res.status(StatusCodes.OK).send(succ);
        } catch (err) {
            Logger.Err(err, true);
            return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err.toString());
        }
    }
}

export default ReviewController;
