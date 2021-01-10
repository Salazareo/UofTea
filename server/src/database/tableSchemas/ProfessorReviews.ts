import { CreateTableInput } from 'aws-sdk/clients/dynamodb';

export const ProfessorReviewsSchema: CreateTableInput = {
    TableName: 'ProfessorReviews',
    KeySchema: [
        { AttributeName: 'professor', KeyType: 'HASH' },
        { AttributeName: 'time', KeyType: 'RANGE' }
    ], AttributeDefinitions: [
        { AttributeName: 'professor', AttributeType: 'S' },
        { AttributeName: 'time', AttributeType: 'N' },
        { AttributeName: 'user', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'userIndex',
            KeySchema: [
                { AttributeName: 'user', KeyType: 'HASH' },
                { AttributeName: 'professor', KeyType: 'RANGE' }],
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