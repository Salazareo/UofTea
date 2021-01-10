import { updateCourseCacheJob } from './updateCourseCacheJob';
import { updateProfCacheJob } from './updateProfCacheJob';

export const cronJobs: { cron: string, job: () => void }[] = [updateProfCacheJob, updateCourseCacheJob];