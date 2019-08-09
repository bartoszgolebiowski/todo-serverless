'use strict';
const id = require('uuid/v1');

const creteTodoJSON = (input) => {
    const idJSON = {"todo_id": id()};
    return Object.assign({}, input, idJSON);
};


const createDBObjectToUpdateName = (tableName, input) => {
    const {todo_id, author} = input;
    return {
        TableName: tableName,
        Key: {
            todo_id,
        },
        UpdateExpression: "set author = :author",
        ExpressionAttributeValues: {
            ":author": author
        },
        ReturnValues: "UPDATED_NEW"
    };
};

module.exports = {
    createTodoJSON: creteTodoJSON,
    createDBObjectToUpdateName: createDBObjectToUpdateName,
};


