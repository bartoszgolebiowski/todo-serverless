const {expect} = require('chai');
const {describe} = require("mocha");
const fetch = require('node-fetch');
const AWS = require('aws-sdk');

const URL = 'http://localhost:3000';
const tableName = 'userTable';
const dbClient = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
});

describe('userController integration tests', () => {
    context('create new user', () => {
        it('correct input', async () => {
            const input = {
                "username": "admin",
                "password": "admin"
            };
            const result = await fetch(URL + '/user/create', {method: 'POST', body: JSON.stringify(input)})
                .then(res => Promise.all([res.status, res.json()]))
                .catch(res=> console.log(res));
            console.log(result);
        });
    });

    context('log in correct input', () => {
        it('correct input', async () => {
            const input = {
                "username": "admin",
                "password": "admin"
            };
            const result = await fetch(URL + '/login', {method: 'POST', body: JSON.stringify(input)})
                .then(res => Promise.all([res.status, res.json()]))
                .catch(res=> console.log(res));
            console.log(result);
        });
    });
});