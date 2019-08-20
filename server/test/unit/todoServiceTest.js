const {expect} = require('chai');
const {describe} = require("mocha");
const {createTodoJSON, createDBObjectToUpdateAuthor} = require('../../src/controller/todo/todoService');

describe('todoService tests', () => {
    context('creteTodoJSON tests', () => {
        it('correct input without id', () => {
            const input = {
                "name": "Naucz sie nodejs!"
            };

            const result = createTodoJSON(input);

            expect(result).to.be.an('object');
            expect(result).to.have.all.keys('todo_id', 'name')
        });
        it('correct input with id', () => {
            const input = {
                "todo_id": "id",
                "name": "Naucz sie nodejs!"
            };

            const result = createTodoJSON(input);

            expect(result).to.be.an('object');
            expect(result).to.have.all.keys('todo_id', 'name');
            expect(result.todo_id).to.not.deep.equal("id");
        });
    });
    context('createDBObjectToUpdateAuthor tests', () => {
        it('correct input', () => {
            const tableName = 'todoTable';
            const input = {
                "todo_id": "id",
                "name": "Naucz sie nodejs!",
                "author": "Jakub"
            };

            const result = createDBObjectToUpdateAuthor(tableName, input);
            const {TableName, Key, ExpressionAttributeValues} = result;


            expect(result).to.be.an('object');
            expect(result).to.have.all.keys('TableName', 'Key', 'UpdateExpression', 'ExpressionAttributeValues', 'ReturnValues');
            expect(TableName).to.be.deep.equal(tableName);
            expect(Key).to.be.deep.equal({todo_id: input.todo_id});
            expect(ExpressionAttributeValues).to.be.deep.equal({":author": input.author});
        })
    })
});