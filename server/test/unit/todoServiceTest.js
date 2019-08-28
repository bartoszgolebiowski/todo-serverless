const {expect} = require('chai');
const {describe} = require("mocha");
const {createTodoJSON} = require('../../src/controller/todo/todoService');

describe('todoService tests', () => {
    context('creteTodoJSON tests', () => {
        it('correct input without id', () => {
            const input = {
                "name": "Naucz sie nodejs!"
            };

            const result = createTodoJSON(input);

            expect(result).to.be.an('object');
            expect(result).to.have.all.keys('todo_id', 'name','comments')
        });
        it('correct input with id', () => {
            const input = {
                "todo_id": "id",
                "name": "Naucz sie nodejs!"
            };

            const result = createTodoJSON(input);

            expect(result).to.be.an('object');
            expect(result).to.have.all.keys('todo_id', 'name','comments')
            expect(result.todo_id).to.not.deep.equal("id");
        });
    });
});