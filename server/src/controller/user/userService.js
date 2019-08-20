'use strict';
const bcrypt = require('bcryptjs');

const hashPassword = async (userJSON) => {
    return {...userJSON, "password": await bcrypt.hash(userJSON.password, 10)}
};

module.exports = {
    hashPassword: hashPassword,
};