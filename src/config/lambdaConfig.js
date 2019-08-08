'use strict';
const AWS = require('aws-sdk');

let options = {};

if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:3000',
    };
}

const lambda = new AWS.Lambda(options);

module.exports = {
    lambda: lambda,
};
