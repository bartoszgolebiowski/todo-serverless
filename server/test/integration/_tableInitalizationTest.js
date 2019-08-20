const {expect} = require('chai');
const {describe} = require("mocha");
const AWS = require('aws-sdk');

const db = new AWS.DynamoDB({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
});

describe('Check table operations', () => {
    context('Create tables', () => {
        it('create todoTable', async () => {
            const params = {
                "TableName": "todoTable",
                "AttributeDefinitions": [
                    {
                        "AttributeName": "todo_id",
                        "AttributeType": "S"
                    }
                ],
                "KeySchema": [
                    {
                        "AttributeName": "todo_id",
                        "KeyType": "HASH"
                    }
                ],
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 1,
                    "WriteCapacityUnits": 1
                }
            };
            await db.createTable(params).promise()
                .then(() => console.log("todoTable was created!"))
                .catch(() => console.log("todoTable is already created!"));
        })
    });
});
