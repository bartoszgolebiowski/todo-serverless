'use strict';
const {dbClient} = require('../../config/dbConfig');
const {HTTP_OK_NO_CONTENT, CONFLICT, UNPROCESSABLE_ENTITY, INTERNAL_ERROR} = require('../../utils/constants');
const {response, validateInput, emptyFieldsError} = require('../../utils/genericService');
const {createDBObjectToPut, createDBObjectToGet} = require('../../utils/dbService');
const {hashPassword} = require('./userService');

const createUser = async (event) => {
    const input = JSON.parse(event.body);
    const inputErrors = validateInput(input);

    if (Array.isArray(inputErrors) && inputErrors.length) {
        return response(UNPROCESSABLE_ENTITY, emptyFieldsError(inputErrors));
    }

    const getUserParam = createDBObjectToGet(process.env.USER_TABLE, {"username": input.username});
    return await Promise.all([dbClient.get(getUserParam).promise(), hashPassword(input)])
        .then(o1 => {
            if (Object.keys(o1[0]).length !== 0 && o1[0].constructor === Object)
                throw 'User already exists';
            else {
                const entity = createDBObjectToPut(process.env.USER_TABLE, o1[1]);
                return dbClient.put(entity).promise();
            }
        })
        .then(() => response(HTTP_OK_NO_CONTENT, {"message": "User created!"}))
        .catch((o2) => o2 === 'User already exists' ?
            response(CONFLICT, {"message": "User could not be created!", "error": o2}) :
            response(INTERNAL_ERROR, {"message": "User could not be created!", "error": o2}))
};

module.exports = {
    createUser: createUser,
};