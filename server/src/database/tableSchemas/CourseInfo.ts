import { CreateTableInput } from 'aws-sdk/clients/dynamodb';

export const CourseInfoSchema: CreateTableInput = {
    TableName: 'CourseInfo',
    KeySchema: [
        { AttributeName: 'subject', KeyType: 'HASH' }, // CSC
        { AttributeName: 'identifier', KeyType: 'RANGE' } // 490H5
    ],
    AttributeDefinitions: [
        { AttributeName: 'subject', AttributeType: 'S' },
        { AttributeName: 'identifier', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
}