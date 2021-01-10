import { Logger } from '@overnightjs/logger';
import { AWSError, DynamoDB } from 'aws-sdk';
import { BatchWriteItemInput, CreateTableInput, CreateTableOutput, WriteRequest } from 'aws-sdk/clients/dynamodb';
import * as fs from 'fs';
import * as path from 'path';
import { dynamo, IS_DEV } from '../utils/constants';
const chunkSize = 12;
export const campusMapper = (campus: string) => {
    switch (campus) {
        case 'Mississauga':
            return 'utm'
        case 'St. George':
            return 'utsg'
        case 'Scarborough':
            return 'utsc'
        default:
            return campus
    }
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const yearMapper = (year: string) => {
    switch (year) {
        case '100/a':
            return 100
        case '200/b':
            return 200
        case '300/c':
            return 300
        case '400/d':
            return 400
        default:
            return Number(year)
    }
}

const populateCourses = async () => {
    try {
        const alreadyAdded: string[] = [];
        const courseFileData = fs.readFileSync(path.resolve(__dirname, './baseData/nikel_dump.json'), 'utf8');
        const courseSet: any[] = JSON.parse(courseFileData);
        const offerings = {} as { courseCode: string[], [key: string]: string[] }
        courseSet.forEach((course: any) => {
            offerings[course.code] = (offerings[course.code] || []).concat([course.term.toLowerCase()]);
        });
        for (let chunk = 0; chunk < courseSet.length; chunk += chunkSize) {
            const courseSetChunk = courseSet.slice(chunk, chunk + chunkSize);
            const batchWriteParam: BatchWriteItemInput = {
                RequestItems: {
                    CourseInfo: []
                }
            } as BatchWriteItemInput;
            for (const course of courseSetChunk) {
                if (alreadyAdded.includes(course.code.toLowerCase())) {
                    continue;
                }
                const courseData = {
                    PutRequest: {
                        Item: {
                            subject: course.code.toLowerCase().substring(0, 3),
                            identifier: course.code.toLowerCase().substring(3),
                            level: yearMapper(course.level.toLowerCase()),
                            breadth: [] as string[],
                            campus: campusMapper(course.campus),
                            courseName: course.name,
                            term: [] as string[]
                        }
                    }
                };
                const distributionLst = [];
                if (course.arts_and_science_breadth) {
                    const artSciDistLst = course.arts_and_science_breadth.split(' + ');
                    for (const breadth of artSciDistLst) {
                        distributionLst.push(breadth.toLowerCase());
                    }
                }
                if (course.utm_distribution) {
                    const utmDistLst = course.utm_distribution.split(' or ');
                    for (const breadth of utmDistLst) {
                        distributionLst.push(breadth.toLowerCase());
                    }
                }
                if (course.utsc_breadth) {
                    const utscDistLst = course.utsc_breadth.split(' + ');
                    for (const breadth of utscDistLst) {
                        distributionLst.push(breadth.toLowerCase());
                    }
                }
                courseData.PutRequest.Item.term = offerings[course.code];
                courseData.PutRequest.Item.breadth = distributionLst;
                batchWriteParam.RequestItems.CourseInfo.push(courseData as WriteRequest);
                alreadyAdded.push(course.code.toLowerCase());
            }
            await dynamo.batchWrite(batchWriteParam, (err) => {
                if (err) {
                    Logger.Err(err, true);
                }
            }).promise();
            if (!IS_DEV) {
                await delay(1500);
            }
        }
    } catch (err) {
        Logger.Err(err, true);
    }
}
const populateProfessors = async () => {
    try {
        const lookupCache = new Map<string, { campus: string | undefined, division: string | undefined, department: string | undefined }>();
        const profDataMap: Map<string, Set<string>> = new Map();
        const dumpData = fs.readFileSync(path.resolve(__dirname, './baseData/nikel_dump.json'), 'utf8');
        const dumpSet: any[] = JSON.parse(dumpData);
        for (const course of dumpSet) {
            lookupCache.set(course.code.toLowerCase(), {
                campus: course.campus,
                division: course.division,
                department: course.department
            });

        }
        const evalData = fs.readFileSync(path.resolve(__dirname, './baseData/evals.json'), 'utf8');
        const evalSet: any[] = JSON.parse(evalData);
        for (const course of evalSet) {
            for (const term of course.terms) {
                for (const lecture of term.lectures) {
                    const profName = lecture.firstname.toLowerCase() + ' ' + lecture.lastname.toLowerCase();
                    const flipped = lecture.lastname.toLowerCase() + ' ' + lecture.firstname.toLowerCase();
                    if (!profDataMap.has(profName) && !profDataMap.has(flipped)) {
                        profDataMap.set(profName, new Set<string>());
                        profDataMap.get(profName)!.add(course.id.toLowerCase());
                    } else if (profDataMap.has(flipped)) {
                        profDataMap.get(flipped)!.add(course.id.toLowerCase());
                    } else {
                        profDataMap.get(profName)!.add(course.id.toLowerCase());
                    }
                }
            }
        }

        const profDataList: { profName: string, courses: Set<string> }[] = [];
        profDataMap.forEach((courses, profName) => {
            profDataList.push({ profName, courses });
        });
        for (let chunk = 0; chunk < profDataList.length; chunk += chunkSize) {
            const profDataChunk = profDataList.slice(chunk, chunk + chunkSize);
            const batchWriteParam: BatchWriteItemInput = {
                RequestItems: {
                    ProfessorInfo: []
                }
            } as BatchWriteItemInput;
            for (const profData of profDataChunk) {
                const profItem = {
                    PutRequest: {
                        Item: {
                            professor: profData.profName,
                            departments: [] as string[],
                            campus: [] as string[],
                        }
                    }
                };
                for (const course of profData.courses) {
                    if (course) {
                        if (lookupCache.has(course.toLowerCase())) {
                            const courseData = lookupCache.get(course.toLowerCase());
                            if (courseData!.department && !profItem.PutRequest.Item.departments.includes(courseData!.department)) {
                                profItem.PutRequest.Item.departments.push(courseData!.department);
                            }
                            if (courseData!.campus && !profItem.PutRequest.Item.campus.includes(campusMapper(courseData!.campus))) {
                                profItem.PutRequest.Item.campus.push(campusMapper(courseData!.campus));
                            }
                        }
                    }
                }
                // UTSC doesnt have this data, so we're gonna hard guess its UTSC
                if (!profItem.PutRequest.Item.campus.length) {
                    profItem.PutRequest.Item.campus.push('utsc');
                    profItem.PutRequest.Item.departments.push('University of Toronto Scarborough');


                }
                batchWriteParam.RequestItems.ProfessorInfo.push(profItem as WriteRequest);
            }
            await dynamo.batchWrite(batchWriteParam, (err) => {
                if (err) {
                    Logger.Err(err, true);
                }
            }).promise();
            if (!IS_DEV) {
                await delay(1500);
            }
        }
    } catch (err) {
        Logger.Err(err, true);
    }
}
const populateDB = (data: CreateTableOutput | null) => {
    try {
        if (data) {
            if (data.TableDescription?.TableName) {
                const params = {
                    TableName: data.TableDescription.TableName
                };
                new DynamoDB().waitFor('tableExists', params, async (err, retData) => {
                    if (err) {
                        Logger.Err(err);
                    }
                    else {
                        switch (retData.Table?.TableName) {
                            case 'ProfessorInfo':
                                return populateProfessors();
                            case 'CourseInfo':
                                return populateCourses();
                            default:
                                return Logger.Info('Table does not need to be populated')
                        }
                    }
                });
            }
        }
    }
    catch (err) {
        Logger.Err(err, true);
    }
}

export const CreateDB = (params: CreateTableInput,
    completionCallback: (err: AWSError | null, data: CreateTableOutput | null) => void
        = (err, data) => { err ? Logger.Err(err) : populateDB(data) }) => {

    new DynamoDB().createTable(params, (err, data) => {
        if (!err || err.code === 'ResourceInUseException') {
            completionCallback(null, data);
        } else {
            completionCallback(err, data);
        }
    });
};
