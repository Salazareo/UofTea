import { Logger } from '@overnightjs/logger';
import { dynamo, PROFS, redis } from '../constants';

const updateProfCache = async () => {
    try {
        const data = await dynamo.scan({ TableName: 'ProfessorInfo' }).promise();
        try {
            if (redis && redis.client.connected) {
                redis.HSET!([PROFS, 'DEFAULT', JSON.stringify(data.Items)]);
                Logger.Info('Updated prof caching');
            } else {
                Logger.Err('Redis Offline, can\'t cache');
            }
        }
        catch (e) {
            Logger.Err(e);
        }
    } catch (err) {
        Logger.Err('Issue updating prof cache')
    }
}

export const updateProfCacheJob = { job: updateProfCache, cron: '*/5 * * * *' }