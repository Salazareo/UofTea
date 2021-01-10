import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { integer } from 'aws-sdk/clients/cloudfront';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { COURSES, dynamo, redis } from '../utils/constants';

interface CourseFilter {
    sort?: string,
    ascending?: 'descending' | 'ascending',
    course?: string,
    breadth?: string[],
    campus?: string[],
    subject?: string,
    level?: integer[],
    term?: string[],
}

@Controller('api/courses')
class CourseController {
    @Get()
    // This needs to be cleaned up
    public async browseCourses(req: Request, res: Response) {
        try {
            const courseFilter = req.query as unknown as CourseFilter;
            if (courseFilter.breadth && !Array.isArray(courseFilter.breadth)) courseFilter.breadth = [courseFilter.breadth];
            if (courseFilter.campus && !Array.isArray(courseFilter.campus)) courseFilter.campus = [courseFilter.campus];
            if (courseFilter.level && !Array.isArray(courseFilter.level)) courseFilter.level = [courseFilter.level];
            if (courseFilter.term && !Array.isArray(courseFilter.term)) courseFilter.term = [courseFilter.term];
            const { sort, ascending, course, breadth, campus, level, term } = courseFilter;
            const limit = parseInt(req.query.limit as string || '15', 10);
            const page = parseInt(req.query.page as string || '1', 10);
            const sortFunction = (a: any, b: any) => {
                const sortKey = sort ? sort as string : 'recommended';
                const ascendingBool = ascending === 'ascending' ? true : false;
                if (sortKey !== 'courseCode') {
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
                } else {
                    const aString = `${a.subject}${a.identifier}`
                    const bString = `${b.subject}${b.identifier}`
                    return aString > bString ?
                        (ascendingBool ? 1 : -1) :
                        (ascendingBool ? -1 : 1)
                }
            }
            // I know it's a long cache key but come on there's nothing else I can do since the query is so complex...
            const cacheKey = `${course || ''}${breadth?.sort().toString()
                || ''}${campus?.sort().toString() || ''}${level?.sort().toString() || ''}` || 'DEFAULT';
            let cacheString;
            // tslint:disable-next-line: no-conditional-assignment
            if (redis && redis.client.connected && (cacheString = await redis.HGET!(COURSES, cacheKey))) {
                const cacheItems: any[] = JSON.parse(cacheString);
                return res.status(StatusCodes.OK).send({
                    items: cacheItems!.sort(sortFunction).slice((page - 1) * limit, page * limit),
                    current: page,
                    pages: Math.ceil(cacheItems!.length / limit)
                });
            } else {
                // tslint:disable-next-line: no-conditional-assignment
                if (redis && redis.client.connected && (cacheString = await redis.HGET!(COURSES, 'DEFAULT'))) {
                    const fromCache: any[] = JSON.parse(cacheString);
                    const parsedItems: any[] = [];
                    for (const item of fromCache!) {
                        let add = true;
                        if (course) {
                            // idk do something need to do a think about it
                            const full: any = course.toString().toLowerCase().match(/([a-z]{1,3})(\w*)/);
                            if (!item.subject.toLowerCase().startsWith(full[1])) {
                                add = false;
                            }
                            if (full[2] && !item.identifier.toLowerCase().startsWith(full[2])) {
                                add = false;
                            }
                        }
                        if (breadth) {
                            let containsFilter = false;
                            for (const courseBreadth of item.breadth) {
                                if (breadth.includes(courseBreadth)) {
                                    containsFilter = true;
                                    break;
                                }
                            }
                            if (!containsFilter) {
                                add = false;
                            }
                        }
                        if (campus && !campus.includes(item.campus)) {
                            add = false;
                        }
                        if (level && !level.includes(item.level.toString())) {
                            add = false;
                        }
                        if (term) {
                            let containsFilter = false;
                            for (const offering of item.term) {
                                for (const offer of term) {
                                    if ((offering as string).includes(offer)) {
                                        containsFilter = true;
                                        break;
                                    }
                                }
                            }
                            if (!containsFilter) {
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
                        redis.HSET!([COURSES, cacheKey, JSON.stringify(parsedItems)]);
                    } catch (e) {
                        Logger.Err(e);
                    }
                    return;
                }
            }

            const filtScan: DocumentClient.ScanInput = {
                TableName: 'CourseInfo',
            } as DocumentClient.ScanInput;
            let filterString = '';
            if (course) {
                const full: RegExpMatchArray = course.toString().toLowerCase().match(/([a-z]{1,3})(\w*)/) as RegExpMatchArray;
                filterString += 'contains(subject, :subject)';
                filtScan.ExpressionAttributeValues = {
                    ...filtScan.ExpressionAttributeValues,
                    ':subject': full[1]
                }
                if (full[2] !== '') {
                    filterString += ' and contains(identifier, :ident)';
                    filtScan.ExpressionAttributeValues = {
                        ...filtScan.ExpressionAttributeValues,
                        ':ident': full[2]
                    }
                }
            }
            if (term) {
                if (filterString) {

                    filterString += ' and ';
                }
                filterString += '(';
                let index = 0;
                for (const filter of term) {
                    if (index !== 0 && index <= filter.length - 1) {
                        filterString += ' or ';
                    }
                    filterString += `contains(term, :term${index})`;
                    filtScan.ExpressionAttributeValues = {
                        ...filtScan.ExpressionAttributeValues,
                        [`:term${index}`]: filter.toString().toLowerCase()
                    }
                    index++;
                }
                filterString += ')';
            }
            if (breadth) {
                // jank AF but reject filters not found in the enum so the rest of the query doesn't break
                if (filterString) {

                    filterString += ' and ';
                }
                filterString += '(';
                let index = 0;
                for (const filter of breadth) {
                    if (index !== 0 && index <= filter.length - 1) {
                        filterString += ' or ';
                    }
                    filterString += `contains(#breadth, :breadth${index})`;
                    filtScan.ExpressionAttributeValues = {
                        ...filtScan.ExpressionAttributeValues,
                        [`:breadth${index}`]: filter.toString().toLowerCase()
                    }
                    filtScan.ExpressionAttributeNames = {
                        ...filtScan.ExpressionAttributeNames,
                        '#breadth': 'breadth'
                    }
                    index++;
                }
                filterString += ')';

            }
            if (campus) {
                if (filterString) {
                    filterString += ' and ';
                }
                filterString += '(';
                let index = 0;
                for (const filter of campus) {
                    if (index !== 0 && index <= campus.length - 1) {
                        filterString += ' or ';
                    }
                    filterString += `:campus${index} =  campus`;
                    filtScan.ExpressionAttributeValues = {
                        ...filtScan.ExpressionAttributeValues,
                        [`:campus${index}`]: filter.toLowerCase()
                    }
                    index++;
                }
                filterString += ')';
            }
            if (level) {
                if (filterString) {
                    filterString += ' and ';
                }
                filterString += '(';
                let index = 0;
                for (const year of level) {
                    if (index !== 0 && index <= level.length - 1) {
                        filterString += ' or ';
                    }
                    filterString += `#level = :year${year}`;
                    filtScan.ExpressionAttributeValues = {
                        ...filtScan.ExpressionAttributeValues,
                        [`:year${year}`]: Number(year)
                    }
                    index++;
                }
                filterString += ')';
                filtScan.ExpressionAttributeNames = { ...filtScan.ExpressionAttributeNames, '#level': 'level' };
            }
            if (filterString) {
                filtScan.FilterExpression = filterString;
            }
            const items = (await (dynamo.scan(filtScan).promise())).Items;
            res.status(StatusCodes.OK).send({
                items: items?.sort(sortFunction).slice((page - 1) * limit, page * limit) || [],
                pages: Math.ceil((items?.length || 0) / limit) || 1,
                current: page
            });
            try {
                if (redis && redis.client.connected) {
                    redis.HSET!([COURSES, cacheKey, JSON.stringify(items)]);
                }
            } catch (e) {
                Logger.Err(e);
            }
        } catch (err) {
            Logger.Err(err, true);
            return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err.toString());
        }
    }

}
export default CourseController;