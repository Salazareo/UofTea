import { Logger } from '@overnightjs/logger';
import { COURSES, dynamo, redis } from '../constants';

const updateCourseCache = async () => {
    try {
        const data = await dynamo.scan({ TableName: 'CourseInfo' }).promise();
        try {
            if (redis && redis.client.connected) {
                redis.HSET!([COURSES, 'DEFAULT', JSON.stringify(data.Items)]);
                Logger.Info('Updated course caching');
            } else {
                Logger.Err('Redis Offline, can\'t cache');
            }
        }
        catch (e) {
            Logger.Err(e);
        }
    } catch (err) {
        Logger.Err('Issue updating course cache')
    }
}

export const updateCourseCacheJob = { job: updateCourseCache, cron: '*/5 * * * *' }