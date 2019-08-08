const {expect} = require('chai');
const {describe} = require("mocha");
const {createTodoJSON} = require('../../src/todo/todoService');
const id = require('uuid');

describe('todoService tests', () => {
    context('creteTodoJSON tests', () => {
        it('correct input', () => {
            const input = {
                "name": "Naucz sie nodejs!"
            };

            const result = createTodoJSON(input);

            expect(result).to.be.an('object');
            expect(result).to.have.all.keys('todo_id','name')
        });
    });

});