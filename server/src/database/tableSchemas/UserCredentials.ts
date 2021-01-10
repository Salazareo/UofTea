import { CreateTableInput } from 'aws-sdk/clients/dynamodb';

export const UserCredentialsSchema: CreateTableInput = {
    TableName: 'UserCredentials',
    KeySchema: [
        { AttributeName: 'email', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
        { AttributeName: 'email', AttributeType: 'S' },
        { AttributeName: 'rUrl', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'ResetURL',
            KeySchema: [{ AttributeName: 'rUrl', KeyType: 'HASH' }],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        }
    ]
}