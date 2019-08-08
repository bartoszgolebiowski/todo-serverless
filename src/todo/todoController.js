'use strict';
const {dbClient} = require('../config/dbConfig');
const {HTTP_OK, UNPROCESSABLE_ENTITY, INTERNAL_ERROR} = require('../utils/constants');
const {response, validateInput, emptyFieldsError} = require('../utils/genericService');
const {createDBObjectToPut, putItem} = require('../utils/dbService');
const {createTodoJSON} = require('./todoService');

const createTodo = async (event) => {
    const input = JSON.parse(event.body);
    const inputErrors = validateInput(input);

    if (Array.isArray(inputErrors) && inputErrors.length) {
        throw Error(response(UNPROCESSABLE_ENTITY, emptyFieldsError(inputErrors)));
    }
    const entity = createTodoJSON(input);
    const todoDBObject = createDBObjectToPut(process.env.TODO_TABLE, entity);
    return await putItem(dbClient, todoDBObject)
        .then(o1 => response(HTTP_OK, {"message": "Todo saved!"}))
        .catch(o1 => response(INTERNAL_ERROR, {"message": "Todo could not be saved!"}))
};

module.exports = {
    createTodo: createTodo,
};