'use strict';
const id = require('uuid/v1');

const creteTodoJSON = (input) => {
    const idJSON = {"todo_id": id()};
    return Object.assign({}, input, idJSON);
};

module.exports = {
    createTodoJSON: creteTodoJSON
};


