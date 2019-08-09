'use strict';

const createDBObjectToScan = (tableName) => {
    return {
        TableName: tableName,
    };
};

const createDBObjectToGet = (tableName, json) => {
    return {
        TableName: tableName,
        Key: json
    };
};

const createDBObjectToDelete = (tableName, json) => {
    return {
        TableName: tableName,
        Key: json,
    };
};

const createDBObjectToPut = (tableName, json) => {
    return {
        TableName: tableName,
        Item: json
    };
};

module.exports = {
    createDBObjectToPut: createDBObjectToPut,
    createDBObjectToGet: createDBObjectToGet,
    createDBObjectToScan: createDBObjectToScan,
    createDBObjectToDelete: createDBObjectToDelete,
};