'use strict';
const id = require('uuid/v1');

const creteTodoJSON = (input) => {
    const idJSON = {"todo_id": id()};
    return Object.assign({}, input, idJSON, {"comments": []});
};
const addMessageToTodoJSON = (tableName, input) => {
    const {todo_id, comment} = input;
    return {
        TableName: tableName,
        Key: {todo_id},
        UpdateExpression: 'set #comments = list_append(if_not_exists(#comments, :empty_list), :comment)',
        ExpressionAttributeNames: {
            '#comments': 'comments'
        },
        ExpressionAttributeValues: {
            ':comment': [comment],
            ':empty_list': [],
        },
        ReturnValues: 'ALL_NEW'
    }
};
module.exports = {
    createTodoJSON: creteTodoJSON,
    addMessageToTodoJSON: addMessageToTodoJSON,
};


