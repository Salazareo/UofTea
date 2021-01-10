import { CreateTableInput } from 'aws-sdk/clients/dynamodb';

export const UserInfoSchema: CreateTableInput = {
    TableName: 'UserInfo',
    KeySchema: [
        { AttributeName: 'username', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
        { AttributeName: 'username', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
}