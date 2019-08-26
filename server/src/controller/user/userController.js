'use strict';
const {dbClient} = require('../../config/dbConfig');
const {HTTP_OK_NO_CONTENT, CONFLICT, UNPROCESSABLE_ENTITY, INTERNAL_ERROR, UNAUTHORIZED, FORBIDDEN, TOKEN_TYPE} = require('../../utils/constants');
const {response, validateInput, emptyFieldsError} = require('../../utils/genericService');
const {createDBObjectToPut, createDBObjectToGet} = require('../../utils/dbService');
const {hashPassword, comparePasswords, generateToken, verifyToken, generatePolicy} = require('./userService');
const {TOKEN_SECRET} = require('../../../secrets');

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
                return Promise.reject('User already exists');
            else {
                const entity = createDBObjectToPut(process.env.USER_TABLE, o1[1]);
                return dbClient.put(entity).promise();
            }
        })
        .then(() => response(HTTP_OK_NO_CONTENT, {"message": "User created!"}))
        .catch((o2) => o2 === 'User already exists' ?
            response(CONFLICT, {"message": "User could not be created!", "error": "User already exists"}) :
            response(INTERNAL_ERROR, {"message": "User could not be created!", "error": o2}))
};

const login = async (event) => {
    const input = JSON.parse(event.body);
    const inputErrors = validateInput(input);

    if (Array.isArray(inputErrors) && inputErrors.length) {
        return response(UNPROCESSABLE_ENTITY, emptyFieldsError(inputErrors));
    }

    const getUserParam = createDBObjectToGet(process.env.USER_TABLE, {"username": input.username});
    return await dbClient.get(getUserParam).promise()
        .then(o1 => Object.keys(o1).length === 0 && o1.constructor === Object ?
            Promise.reject('User does not exists') :
            Promise.all([comparePasswords(input.password, o1.Item.password), generateToken(input.username, TOKEN_SECRET)]))
        .then((o2) => o2[0] ?
            response(HTTP_OK_NO_CONTENT, {"message": "User Logged!", "token_type": TOKEN_TYPE, "token": o2[1]}) :
            response(UNAUTHORIZED, {"message": "Can not Login!", "error": "Password does not match!"}))
        .catch((o3) => o3 === 'User does not exists' ?
            response(CONFLICT, {"message": "Can not Login!", "error": "User does not exists!"}) :
            response(INTERNAL_ERROR, {"message": "Can not Login!", "error": o3}));
};

const auth = async (event) => {
    const token = event.authorizationToken;

    if (!token)
        return response(FORBIDDEN, 'Missing authorization Token');

    return await verifyToken(token, TOKEN_SECRET)
        .then(o1 => generatePolicy(o1.username, 'Allow', event.methodArn))
        .catch((o2) => response(UNAUTHORIZED, {"message" : 'Authentication error', "error": o2}));
};

module.exports = {
    auth: auth,
    login: login,
    createUser: createUser,
};