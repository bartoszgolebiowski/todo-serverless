'use strict';
const id = require('uuid/v1');

const creteTodoJSON = (json) => {
    const idJSON = {"todo_id": id()};
    return Object.assign(idJSON, json);
};

module.exports= {
    createTodoJSON:creteTodoJSON,
};


