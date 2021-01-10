import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as jwt from 'express-jwt';
import { StatusCodes } from 'http-status-codes';
import * as nodeCron from 'node-cron';
import * as path from 'path';
import Controllers from './controllers';
import { CreateDB } from './database/dbHelpers';
import TableSchemas from './database/tableSchemas';
import { cookieSecret, jwtSecret } from './secrets';
import { IS_DEV, PUBLIC_PATHS } from './utils/constants';
import { cronJobs } from './utils/cronsJobs';

class UofTeaServer extends Server {

    private readonly SERVER_START_MSG = 'UofTea server started on port: ';
    private readonly DEV_MSG = 'Express Server is running in development mode. ' +
        'No front-end content is being served.';

    constructor() {
        super(true);
        this.app.set('trust proxy', true);
        this.app.use(cookieParser(cookieSecret));
        this.app.use(compression());
        this.app.use(jwt({
            credentialsRequired: true,
            secret: jwtSecret,
            algorithms: ['HS256'],
            getToken: (req: { signedCookies: { token: string | undefined; }; }) => req.signedCookies.token
        }).unless({ path: PUBLIC_PATHS }));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors({
            origin: IS_DEV ? undefined : ['https://uoftea.ca', 'https://www.uoftea.ca']
        }));
        const Fingerprint = require('express-fingerprint')
        this.app.use(Fingerprint(
            {
                parameters: [
                    Fingerprint.useragent,
                    Fingerprint.acceptHeaders,
                    Fingerprint.geoip,
                    (next: (arg0: null, arg1: any) => any, req: { ip: any; }) => next(null, { ip: req.ip })
                ]
            }
        ));
        this.app.use((req, res, next) => {
            if (['wget', 'curl', 'other'].includes((req as any).fingerprint.components.useragent.browser.family.toLowerCase())) {
                res.status(StatusCodes.UNAUTHORIZED).send();
            }
            else {
                next();
            }
        });
        this.setupControllers();
        this.app.all(/api\/.*/, (_req, res) => res.status(StatusCodes.NOT_ACCEPTABLE).end());
        this.createTablesIfNotExists();
        if (IS_DEV) {
            this.setUpCronJobs();
            Logger.Info(this.DEV_MSG)
            this.app.get('*', (_req, res) => res.send(this.DEV_MSG));
        } else {
            this.serveFrontEndProd();
        }
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            Logger.Imp(this.SERVER_START_MSG + port);
        });
    }

    private setupControllers(): void {
        const ctlrInstances = [];
        for (const Controller of Controllers) {
            ctlrInstances.push(new Controller())
        }
        super.addControllers(ctlrInstances);
    }

    private createTablesIfNotExists(): void {
        for (const tableParam of TableSchemas) {
            CreateDB(tableParam);
        }
    }

    private serveFrontEndProd(): void {
        const dir = path.join('./build/public/react/UofTea');
        this.app.use(express.static(dir));
        this.app.get('*', (_req, res) => {
            res.sendFile('index.html', { root: dir });
        });
    }
    private setUpCronJobs() {
        cronJobs.forEach(({ cron, job }) => {
            try {
                job();
            }
            catch (err) {
                Logger.Err(err, true)
            }
            nodeCron.schedule(cron, job);
        })
    }
}

export default UofTeaServer;
