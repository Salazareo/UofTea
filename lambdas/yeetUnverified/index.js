const { DynamoDB } = require('aws-sdk');
const dbClient = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'us-east-1' });
const delay = (ms) => new Promise(res => setTimeout(res, ms));

exports.handler = async (_event) => {
    try {

        const toDelete = await dbClient.scan({
            TableName: 'UserCredentials',
            FilterExpression: 'attribute_exists(secretKey) AND (attribute_not_exists(created) OR created <= :twoWeeks)',
            ExpressionAttributeValues: {
                ':twoWeeks': Date.now() - 1000 * 60 * 60 * 24 * 14
            }
        }).promise();
        for (let chunk = 0; chunk < toDelete.Items.length; chunk += 10) {
            const toDeleteChunk = toDelete.Items.slice(chunk, chunk + 10);
            const batchDelParam = {
                RequestItems: {
                    UserCredentials: [],
                    UserInfo: []
                }
            };
            for (const user of toDeleteChunk) {
                if (!user.secretKey) {
                    continue;
                }
                batchDelParam.RequestItems.UserCredentials.push({
                    DeleteRequest: {
                        Key: {
                            email: user.email
                        }
                    }
                });
                batchDelParam.RequestItems.UserInfo.push({
                    DeleteRequest: {
                        Key: {
                            username: user.username
                        }
                    }
                });
            }
            await dbClient.batchWrite(batchDelParam).promise();
            await delay(1000);
        }
    }
    catch (err) {
        console.log(err);
    }
}