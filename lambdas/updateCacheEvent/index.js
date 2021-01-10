const redis = require('redis');
const { DynamoDB } = require('aws-sdk');
const { promisify } = require("util");

const { REDIS } = process.env;
const redisClient = redis.createClient(6379, REDIS);
const HSET = promisify(redisClient.HSET).bind(redisClient);
const HGET = promisify(redisClient.HGET).bind(redisClient);
redisClient.on('error', (err) => { console.log(err); throw err })


const dbClient = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'us-east-1' });
exports.handler = async (_event) => {
    try {

        const courseData = await dbClient.scan({ TableName: 'CourseInfo' }).promise();
        await HSET(['COURSES', 'DEFAULT', JSON.stringify(courseData.Items)]);
        const profData = await dbClient.scan({ TableName: 'ProfessorInfo' }).promise();
        await HSET(['PROFS', 'DEFAULT', JSON.stringify(profData.Items)]);
    }
    catch (err) {
        console.log(err);
    }
}
