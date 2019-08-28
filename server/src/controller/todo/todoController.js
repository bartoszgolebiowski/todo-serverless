'use strict';
const {dbClient} = require('../../config/dbConfig');
const {HTTP_OK_NO_CONTENT, HTTP_OK_WITH_CONTENT, UNPROCESSABLE_ENTITY, INTERNAL_ERROR, RESOURCE_DOES_NOT_FIND} = require('../../utils/constants');
const {response, validateInput, emptyFieldsError, createDBObjectToUpdate} = require('../../utils/genericService');
const {createDBObjectToPut, createDBObjectToGet, createDBObjectToDelete, createDBObjectToScan} = require('../../utils/dbService');
const {createTodoJSON, addMessageToTodoJSON} = require('./todoService');

const getSingleTodo = async (event) => {
    const {todo_id} = event.pathParameters;

    if (todo_id === undefined) {
        return response(UNPROCESSABLE_ENTITY, {"message": "Incorrect input", "error": "Missing path parameter"});
    }

    const paramGetSingle = createDBObjectToGet(process.env.TODO_TABLE, {todo_id});
    return await dbClient.get(paramGetSingle).promise()
        .then(o1 => Object.keys(o1).length !== 0 && o1.constructor === Object ?
            response(HTTP_OK_WITH_CONTENT, o1) :
            response(UNPROCESSABLE_ENTITY, {"message": "Todo does not exist", "todo_id": todo_id}))
        .catch((o1) => response(RESOURCE_DOES_NOT_FIND, {"message": "Could not get single todo record", "error": o1}))
};

const getAllTodo = async () => {
    const param = createDBObjectToScan(process.env.TODO_TABLE);
    return await dbClient.scan(param).promise()
        .then(o1 => response(HTTP_OK_WITH_CONTENT, o1))
        .catch((o1) => response(INTERNAL_ERROR, {"message": "Could not get all todos", "error": o1}))
};

const createTodo = async (event) => {
    const input = JSON.parse(event.body);
    const inputErrors = validateInput(input);

    if (Array.isArray(inputErrors) && inputErrors.length) {
        return response(UNPROCESSABLE_ENTITY, emptyFieldsError(inputErrors));
    }
    const entity = createTodoJSON(input);
    const todoDBObject = createDBObjectToPut(process.env.TODO_TABLE, entity);
    return await dbClient.put(todoDBObject).promise()
        .then(() => response(HTTP_OK_WITH_CONTENT, {"message": "Todo saved!", entity}))
        .catch((o1) => response(INTERNAL_ERROR, {"message": "Todo could not be saved!", "error": o1}))
};

const addComment = async (event) => {
    const input = JSON.parse(event.body);
    const inputErrors = validateInput(input);

    if (Array.isArray(inputErrors) && inputErrors.length) {
        return response(UNPROCESSABLE_ENTITY, emptyFieldsError(inputErrors));
    }
    const {todo_id} = input;
    const entity = addMessageToTodoJSON(process.env.TODO_TABLE, input);
    const paramGetSingle = createDBObjectToGet(process.env.TODO_TABLE, {todo_id});
    return await Promise.all([dbClient.get(paramGetSingle).promise(), dbClient.update(entity).promise()])
        .then((o1) => Object.keys(o1[0]).length !== 0 && o1[0].constructor === Object ?
            response(HTTP_OK_NO_CONTENT, {"message": "Comment saved!"}) :
            response(UNPROCESSABLE_ENTITY, {"message": "Todo does not exist", "todo_id": todo_id}))
        .catch((o1) => response(INTERNAL_ERROR, {"message": "Comment could not be saved!", "error": o1}))
};

const deleteTodo = async (event) => {
    const input = JSON.parse(event.body);
    const inputErrors = validateInput(input);

    if (Array.isArray(inputErrors) && inputErrors.length) {
        return response(UNPROCESSABLE_ENTITY, emptyFieldsError(inputErrors));
    }
    const todoDBObject = createDBObjectToDelete(process.env.TODO_TABLE, input);
    const paramGetSingle = createDBObjectToGet(process.env.TODO_TABLE, input);

    return await Promise.all([dbClient.get(paramGetSingle).promise(), dbClient.delete(todoDBObject).promise()])
        .then(o1 => Object.keys(o1[0]).length === 0 && o1[0].constructor === Object ?
            response(UNPROCESSABLE_ENTITY, {
                "message": "Todo could not be deleted!",
                "error": "Can not deleted non existing item"
            }) :
            response(HTTP_OK_NO_CONTENT, {"message": "Todo deleted!"}))
        .catch((o1) => response(INTERNAL_ERROR, {"message": "Todo could not be deleted!", "error": o1}))
};

const updateTodo = async (event) => {
    const input = JSON.parse(event.body);
    const inputErrors = validateInput(input);

    if (Array.isArray(inputErrors) && inputErrors.length) {
        return response(UNPROCESSABLE_ENTITY, emptyFieldsError(inputErrors));
    }
    const todoDBObject = createDBObjectToUpdate(process.env.TODO_TABLE, input, {"todo_id": input.todo_id});
    const paramGetSingle = createDBObjectToGet(process.env.TODO_TABLE, {"todo_id": input.todo_id});

    return await Promise.all([dbClient.get(paramGetSingle).promise(), dbClient.update(todoDBObject).promise()])
        .then(o1 => Object.keys(o1[0]).length === 0 && o1[0].constructor === Object ?
            response(UNPROCESSABLE_ENTITY, {
                "message": "Todo could not be updated!",
                "error": "Can not update non existing item"
            }) :
            response(HTTP_OK_WITH_CONTENT, {"message": "Todo updated!", "item": o1[1]}))
        .catch((o1) => response(INTERNAL_ERROR, {"message": "Todo could not be updated!", "error": o1}))
};

module.exports = {
    createTodo: createTodo,
    deleteTodo: deleteTodo,
    updateTodo: updateTodo,
    getAllTodo: getAllTodo,
    getSingleTodo: getSingleTodo,
    addComment: addComment,
};