import { CreateTableInput } from 'aws-sdk/clients/dynamodb';

export const CourseReviewSchema: CreateTableInput = {
    TableName: 'CourseReviews',
    KeySchema: [
        { AttributeName: 'courseCode', KeyType: 'HASH' },
        { AttributeName: 'time', KeyType: 'RANGE' }
    ], AttributeDefinitions: [
        { AttributeName: 'courseCode', AttributeType: 'S' },
        { AttributeName: 'time', AttributeType: 'N' },
        { AttributeName: 'user', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'userIndex',
            KeySchema: [
                { AttributeName: 'user', KeyType: 'HASH' },
                { AttributeName: 'courseCode', KeyType: 'RANGE' }],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            },
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
}