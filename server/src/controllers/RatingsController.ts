import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Courses } from 'nikel';
import { campusMapper } from '../database/dbHelpers';
import { dynamo } from '../utils/constants';
import { Ratings } from './ReviewController';
@Controller('api/ratings')
class RatingsController {
    @Get('course')
    public async getAllCourseRatings(_req: Request, res: Response) {
        try {
            const scanParam: DocumentClient.ScanInput = {
                TableName: 'CourseInfo',
            }
            const data = await dynamo.scan(scanParam).promise();
            res.status(StatusCodes.OK).send(data.Items)

        } catch (err) {
            Logger.Err(err, true);
            res.status(err.statusCode || StatusCodes.SERVICE_UNAVAILABLE).send(err);
        }
    }
    @Get('course/:courseCode')
    public getCourseRatings(req: Request, res: Response) {
        try {
            const { courseCode } = req.params;
            if (!courseCode) {
                res.status(StatusCodes.BAD_REQUEST).send();
            }
            const subject = courseCode.substring(0, 3).toLowerCase();
            const identifier = courseCode.substring(3);
            const dynamoGetParams: DocumentClient.GetItemInput = {
                TableName: 'CourseInfo',
                Key: {
                    subject,
                    identifier
                },
            };
            dynamo.get(dynamoGetParams, async (err, data) => {
                if (err) {
                    Logger.Err(err.message);
                    return res.status(err.statusCode || StatusCodes.SERVICE_UNAVAILABLE).send(err.message);
                }
                if (data.Item && data.Item.ratings) {
                    const ratings: Ratings & { total: number } = {
                        difficulty: data.Item.ratings.difficulty.avg,
                        recommended: data.Item.ratings.recommended.avg,
                        useful: data.Item.ratings.useful.avg,
                        workload: data.Item.ratings.workload.avg,
                        interesting: data.Item.ratings.interesting.avg,
                        total: data.Item.ratings.difficulty.total || undefined
                    }
                    return res.status(StatusCodes.OK).send(ratings);
                } else {
                    res.status(StatusCodes.NOT_FOUND).send({});
                    const putParam: DocumentClient.PutItemInput = {
                        TableName: 'CourseInfo',
                        Item: {
                            subject,
                            identifier,
                            ratings: {
                                recommended: {
                                    avg: 0,
                                    total: 0
                                },
                                difficulty: {
                                    avg: 0,
                                    total: 0

                                },
                                useful: {
                                    avg: 0,
                                    total: 0

                                },
                                interesting: {
                                    avg: 0,
                                    total: 0
                                },
                                workload: {
                                    avg: 0,
                                    total: 0

                                }
                            }
                        }
                    }
                    if (data.Item) {
                        putParam.Item = {
                            ...putParam.Item,
                            ...data.Item
                        }
                        dynamo.put(putParam, (oopsie, items) => {
                            if (oopsie) {
                                Logger.Err(oopsie);
                            }
                            else {
                                Logger.Info(items.ConsumedCapacity);
                            }
                        });
                    } else {
                        const nikCourses = new Courses();
                        nikCourses.where({ code: { $in: subject + identifier } });
                        const coursesFromNikel = await nikCourses.get();
                        if (coursesFromNikel.length) {
                            const distList = []
                            const nikelCourse = coursesFromNikel[0];
                            if (nikelCourse.arts_and_science_breadth) {
                                const artSciDistLst = nikelCourse.arts_and_science_breadth.split(' + ');
                                for (const breadth of artSciDistLst) {
                                    distList.push(breadth.toLowerCase());
                                }
                            }
                            if (nikelCourse.utm_distribution) {
                                const utmDistLst = nikelCourse.utm_distribution.split(' or ');
                                for (const breadth of utmDistLst) {
                                    distList.push(breadth.toLowerCase());
                                }
                            }
                            if (nikelCourse.utsc_breadth) {
                                const utscDistLst = nikelCourse.utsc_breadth.split(' + ');
                                for (const breadth of utscDistLst) {
                                    distList.push(breadth.toLowerCase());
                                }
                            }
                            const term: string[] = [];
                            coursesFromNikel.forEach((offering) => {
                                term.push(offering.term.toLowerCase());
                            })
                            putParam.Item = {
                                ...putParam.Item,
                                level: nikelCourse.level.toLowerCase(),
                                campus: campusMapper(nikelCourse.campus),
                                breadth: distList
                            }
                            dynamo.put(putParam, (oopsie, items) => {
                                if (oopsie) {
                                    Logger.Err(oopsie);
                                }
                                else {
                                    Logger.Info(items.ConsumedCapacity);
                                }
                            });
                        }
                    }
                }
            });
        } catch (err) {
            Logger.Err(err, true);
            return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err.toString());
        }
    }
}

export default RatingsController;