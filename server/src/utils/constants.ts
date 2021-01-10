import { Logger } from '@overnightjs/logger';
import * as Ajv from 'ajv';
import { config, DynamoDB } from 'aws-sdk';
import { pathToRegexp } from 'path-to-regexp';
import * as RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { promisify } from 'util';
import { AWS_CONFIG } from '../AWS_Config';
const { REDIS } = process.env;

export const IS_DEV = process.env.NODE_ENV !== 'production';


// dynamoDB client
config.update(AWS_CONFIG);
export const dynamo = new DynamoDB.DocumentClient();

// redis client
let redisClient;
let HGET;
let HSET;
try {
    redisClient = createClient(6379, REDIS || 'localhost');
    redisClient.on('error', (err) => {
        if (!IS_DEV) {
            throw err;
        }
    });
    HGET = promisify(redisClient.HGET).bind(redisClient);
    HSET = promisify(redisClient.HSET).bind(redisClient);
} catch (e) {
    Logger.Err(e, true);
    if (!IS_DEV) {
        throw e;
    }
}
export const redis = redisClient ? {
    HGET,
    HSET,
    client: redisClient
} : undefined;
export const limitStore = redisClient ? new RedisStore({ client: redisClient, expiry: 60 * 10 }) : undefined

export const COURSES = 'COURSES';
export const PROFS = 'PROFS';

// schema validator
export const ajv = new Ajv();

// paths w/o jwt
export const PUBLIC_PATHS = [
    '/api/user/login',
    '/api/user/validateJWT',
    '/api/user/register',
    '/api/user/forgot',
    '/api/user/resetPassword',
    /\/api\/courses\/?.*/,
    /\/api\/professors\/?.*/,
    /^(?!\/api).*/,
    pathToRegexp('/api/user/verify/:token'),
    /\/api\/reviews\/(course|professor)\/.+/,
    /\/api\/ratings\/course\/.+/,
    '/api/ratings/course',
]