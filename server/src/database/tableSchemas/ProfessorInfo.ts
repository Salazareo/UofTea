import { CreateTableInput } from 'aws-sdk/clients/dynamodb';

export const ProfessorInfoSchema: CreateTableInput = {
    TableName: 'ProfessorInfo',
    KeySchema: [
        { AttributeName: 'professor', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
        { AttributeName: 'professor', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
}