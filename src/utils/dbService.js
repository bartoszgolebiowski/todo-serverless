'use strict';

const putItem = async (ddb, params) => {
    return new Promise((res, rej) => {
        ddb.put(params, (err, data) => {
            if (err) {
                console.log("Error while saving item into DB", params);
                rej(err);
            } else {
                console.log("Save success", params);
                res(params.Item);
            }
        })
    });
};
const createDBObjectToPut = (tableName, json) => {
    return {
        TableName: tableName,
        Item: json
    };
};

module.exports = {
    createDBObjectToPut:createDBObjectToPut,
    putItem: putItem
};