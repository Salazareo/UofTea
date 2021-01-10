import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { dynamo, PROFS, redis } from '../utils/constants';

@Controller('api/professors')
class ProfessorController {
    @Get() // search?name=Sadia&dept=dept1,dept2&campus=utsc&limit=5&page=1&sortBy=name,ascending
    public async browseProf(req: Request, res: Response) {
        try {
            let { name, dept, campus } = req.query;
            const { ascending, sort } = req.query;
            const limit = parseInt(req.query.limit as string || '15', 10);
            const page = parseInt(req.query.page as string || '1', 10);
            const cacheKey = `${dept || ''}${campus || ''}${name || ''}` || 'DEFAULT';
            const sortFunction = (a: any, b: any) => {
                const sortKey = sort ? sort as string : 'recommended';
                const ascendingBool = ascending === 'ascending' ? true : false;

                if (!(a.ratings && a.ratings[sortKey]?.total) && (b.ratings && b.ratings[sortKey]?.total)) {
                    return 1
                }
                else if ((a.ratings && a.ratings[sortKey]?.total) && !(b.ratings && b.ratings[sortKey]?.total)) {
                    return -1
                }

                return ((a.ratings &&
                    a.ratings[sortKey]) ?
                    a.ratings[sortKey].avg : a[sortKey]) > ((b.ratings &&
                        b.ratings[sortKey]) ?
                        b.ratings[sortKey].avg : b[sortKey]) ?
                    (ascendingBool ? 1 : -1) :
                    (ascendingBool ? -1 : 1)
            }

            let cacheString;
            // tslint:disable-next-line: no-conditional-assignment
            if (redis && redis.client.connected && (cacheString = await redis.HGET!(PROFS, cacheKey))) {
                const items: any[] = JSON.parse(cacheString);
                return res.status(StatusCodes.OK).send({
                    items: items!.sort(sortFunction).slice((page - 1) * limit, page * limit),
                    current: page,
                    pages: Math.ceil(items!.length / limit)
                });
            } else {
                // tslint:disable-next-line: no-conditional-assignment
                if (redis && redis.client.connected && (cacheString = await redis.HGET!(PROFS, 'DEFAULT'))) {
                    const items: any[] = JSON.parse(cacheString);
                    const parsedItems: any[] = [];
                    for (const item of items!) {
                        let add = true;
                        if (name) {
                            const names = name.toString().toLowerCase().replace(/%20/g, ' ').split(' ');
                            if (!((item.professor.startsWith(names[0]) && item.professor.includes(names[1] || names[0])) ||
                                item.professor.includes(name.toString().toLowerCase().replace(/%20/g, ' ')))) {
                                add = false;
                            }
                        }
                        if (campus) {
                            campus = campus.toString().replace(/%20/g, ' ').trim().toLowerCase();
                            if (item.campus.indexOf(campus) < 0) {
                                add = false;
                            }
                        }
                        if (add) {
                            parsedItems.push(item);
                        }
                    }
                    res.status(StatusCodes.OK).send({
                        items: parsedItems!.sort(sortFunction).slice((page - 1) * limit, page * limit),
                        current: page,
                        pages: Math.ceil(parsedItems!.length / limit)
                    });
                    try {
                        redis.HSET!([PROFS, cacheKey, JSON.stringify(parsedItems)]);
                    } catch (e) {
                        Logger.Err(e)
                    }
                } else {
                    const scanParam: DocumentClient.ScanInput = {
                        TableName: 'ProfessorInfo',
                        ProjectionExpression: 'ratings, professor, divisions, campus, departments ',
                    };
                    let scanFilter = ''
                    if (campus) {
                        campus = campus.toString().replace(/%20/g, ' ').trim().toLowerCase();
                        scanFilter = 'contains(campus, :campus )';
                        scanParam.ExpressionAttributeValues = {
                            ':campus': campus
                        }
                    }
                    if (dept) {
                        dept = dept.toString().toString().replace(/%20/g, ' ');
                        const deptFilterLst = dept.toString();
                        if (deptFilterLst) {
                            if (scanFilter) {
                                scanFilter += ' and ';
                            }
                            scanFilter += 'departments in (:deptList)';
                            scanParam.ExpressionAttributeValues = { ...scanParam.ExpressionAttributeValues, ':deptList': deptFilterLst };
                        }
                    }
                    if (name) {
                        name = name.toString().replace(/%20/g, ' ');
                        const profName = name.toString().toLowerCase();
                        if (scanFilter) {
                            scanFilter += ' and ';
                        }
                        scanFilter += '(contains(professor,:profName)';
                        scanParam.ExpressionAttributeValues = { ...scanParam.ExpressionAttributeValues, ':profName': profName };

                        if (profName.includes(' ')) {
                            const names = profName.split(' ');
                            scanFilter += ' or (begins_with(professor,:firstName) and contains(professor,:lastName))';
                            scanParam.ExpressionAttributeValues = { ...scanParam.ExpressionAttributeValues, ':firstName': names[0], ':lastName': names[1] }
                        }
                        scanFilter += ')'
                    }
                    if (scanFilter) {
                        scanParam.FilterExpression = scanFilter
                    }
                    const data = await dynamo.scan(scanParam).promise();

                    res.status(StatusCodes.OK).send({
                        items: data.Items?.sort(sortFunction).slice((page - 1) * limit, page * limit) || [],
                        pages: Math.ceil((data.Count || 0) / limit) || 1,
                        current: page
                    });
                    try {
                        if (redis && redis.client.connected) {
                            redis.HSET!([PROFS, cacheKey, JSON.stringify(data.Items)]);
                        }
                    } catch (e) {
                        Logger.Err(e)
                    }
                }
            }
        } catch (err) {
            Logger.Err(err, true);
            return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send(err.message || err);
        }
    }

    @Get(':name')
    public async fetchProfInfo(req: Request, res: Response) {
        try {
            const { name } = req.params;
            const professor = name.toString().toLowerCase().replace(/%20/g, ' ');
            const getParam = {
                TableName: 'ProfessorInfo',
                Key: {
                    professor
                }
            };
            const data = await dynamo.get(getParam).promise();
            if (!data.Item) {
                return res.status(StatusCodes.NOT_FOUND).send('Professor not found');
            }
            return res.status(StatusCodes.OK).send({
                ...data.Item,
                ratings: {
                    clarity: data.Item.ratings?.clarity.avg,
                    engaging: data.Item.ratings?.engaging.avg,
                    recommended: data.Item.ratings?.recommended.avg,
                    total: data.Item.ratings?.recommended.total
                }
            });

        } catch (err) {
            Logger.Err(err, true);
            return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send(err.message || err);

        }
    }
}

export default ProfessorController;