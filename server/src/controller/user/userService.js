'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = async (userJSON) => {
    return {...userJSON, "password": await bcrypt.hash(userJSON.password, 10)}
};
const comparePasswords = async (inputPassword, hash) => {
    return bcrypt.compare(inputPassword, hash)
};

const generateToken = async (username, secret) => {
    return jwt.sign({username}, secret);
};

const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};
const verifyToken = async (authorization, secret) => {
    const token = authorization.split(" ");
    return jwt.verify(token[1], secret);
};

module.exports = {
    generateToken: generateToken,
    comparePasswords: comparePasswords,
    hashPassword: hashPassword,
    generatePolicy: generatePolicy,
    verifyToken: verifyToken
};