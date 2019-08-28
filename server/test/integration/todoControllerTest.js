const {expect} = require('chai');
const {describe} = require("mocha");
const fetch = require('node-fetch');
const AWS = require('aws-sdk');

const {createTodoJSON} = require('../../src/controller/todo/todoService');
const {HTTP_OK_NO_CONTENT, HTTP_OK_WITH_CONTENT, UNPROCESSABLE_ENTITY} = require('../../src/utils/constants');
const {createDBObjectToPut, createDBObjectToDelete, createDBObjectToScan} = require('../../src/utils/dbService');

const URL = 'http://localhost:3000';
const {todoMock} = require('../mock/todoMock');
const tableName = 'todoTable';
const dbClient = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
});


describe('todoController integration tests', () => {

    const generateToken = async () => {
        const input = {
            "username": "admin",
            "password": "admin"
        };
        return fetch(URL + '/login', {method: 'POST', body: JSON.stringify(input)})
            .then(res => res.json())
            .then(res => `${res.token_type} ${res.token}`)
            .catch(res => res.json());
    };

    context('add comment to order', async () => {
        it('correct input', async () => {
            const {Items: ItemsBefore} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            const todo = ItemsBefore[0];
            const input = {
                "todo_id": todo['todo_id'],
                "comment": "O boze, ale slabe"
            };

            const result = await fetch(URL + '/todo/message', {
                method: 'PATCH',
                body: JSON.stringify(input)
            })
                .then(res => Promise.all([res.status, res.json()]));

            const {Items: ItemsAfter} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            const todoWithComment = ItemsAfter.filter(o1 => o1.todo_id === todo.todo_id);

            expect(result[1].message).to.be.deep.equal("Comment saved!");
            expect(todoWithComment[0]['comments']).to.be.length(1);
            expect(todoWithComment[0]['comments']).to.be.deep.equal(["O boze, ale slabe"]);
            expect(result[0]).to.be.deep.equal(HTTP_OK_NO_CONTENT);
            expect(ItemsAfter).to.be.length(5);
        });

        it('wrong input', async () => {
            const input = {
                "todo_id": "123",
                "comment": "O boze, ale slabe"
            };

            const result = await fetch(URL + '/todo/message', {
                method: 'PATCH',
                body: JSON.stringify(input)
            })
                .then(res => Promise.all([res.status, res.json()]))

            expect(result[1]['message']).to.be.deep.equal("Todo does not exist");
            expect(result[1]['todo_id']).to.be.equal(input.todo_id);
            expect(result[0]).to.be.deep.equal(UNPROCESSABLE_ENTITY);
        });

        it('empty input', async () => {
            const input = {
                "todo_id": "",
                "comment": "O boze, ale slabe"
            };

            const result = await fetch(URL + '/todo/message', {
                method: 'PATCH',
                body: JSON.stringify(input)
            })
                .then(res => Promise.all([res.status, res.json()]));

            expect(result[1].error).to.be.deep.equal("Empty fields: todo_id");
            expect(result[1].message).to.be.deep.equal("Incorrect input");
            expect(result[0]).to.be.deep.equal(UNPROCESSABLE_ENTITY);
        });
        beforeEach(async () => {
            for (let singleMock of todoMock) {
                let todoJson = createTodoJSON(singleMock);
                let todoDBObject = createDBObjectToPut(tableName, todoJson);
                await dbClient.put(todoDBObject).promise();
            }
        });

        afterEach(async () => {
            const {Items} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            for (let todo of Items) {
                const {todo_id} = todo;
                let todoDBObject = createDBObjectToDelete(tableName, {
                    "todo_id": todo_id,
                });
                await dbClient.delete(todoDBObject).promise();
            }
        });
    });

    context('get all todos tests', async () => {

        it('get all todos', async () => {
            const token = await generateToken();
            const {Items} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            const result = await fetch(URL + '/todo', {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            })
                .then(res => Promise.all([res.status, res.json()]));

            expect(result[1].Items).to.be.deep.equal(Items);
            expect(result[1].Items).to.be.length(5);
            expect(result[1].Count).to.be.equal(5);
            expect(result[0]).to.be.deep.equal(HTTP_OK_WITH_CONTENT);
        });

        beforeEach(async () => {
            for (let singleMock of todoMock) {
                let todoJson = createTodoJSON(singleMock);
                let todoDBObject = createDBObjectToPut(tableName, todoJson);
                await dbClient.put(todoDBObject).promise();
            }
        });

        afterEach(async () => {
            const {Items} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            for (let todo of Items) {
                const {todo_id} = todo;
                let todoDBObject = createDBObjectToDelete(tableName, {
                    "todo_id": todo_id,
                });
                await dbClient.delete(todoDBObject).promise();
            }
        });

    });

    context('create Todo tests', () => {

        it('correct input', async () => {
            const input = {
                "name": "nowy Todo z testu integracyjnego"
            };

            const result = await fetch(URL + '/todo/create', {
                method: 'POST',
                body: JSON.stringify(input)
            })
                .then(res => Promise.all([res.status, res.json()]));

            const {Items} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            expect(result[1].message).to.be.deep.equal("Todo saved!");
            expect(result[1].entity.name).to.be.deep.equal("nowy Todo z testu integracyjnego");
            expect(result[1].entity).to.have.all.keys('todo_id', 'name', 'comments');
            expect(result[0]).to.be.deep.equal(HTTP_OK_WITH_CONTENT);
            expect(Items).to.be.length(6);
        });

        it('empty field', async () => {
            const input = {
                "name": ""
            };

            const result = await fetch(URL + '/todo/create', {
                method: 'POST',
                body: JSON.stringify(input)
            })
                .then(res => Promise.all([res.status, res.json()]));

            const {Items} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            expect(result[1].error).to.be.deep.equal("Empty fields: name");
            expect(result[1].message).to.be.deep.equal("Incorrect input");
            expect(result[0]).to.be.deep.equal(UNPROCESSABLE_ENTITY);
            expect(Items).to.be.length(5);
        });

        beforeEach(async () => {
            for (let singleMock of todoMock) {
                let todoJson = createTodoJSON(singleMock);
                let todoDBObject = createDBObjectToPut(tableName, todoJson);
                await dbClient.put(todoDBObject).promise();
            }
        });

        afterEach(async () => {
            const {Items} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            for (let todo of Items) {
                const {todo_id} = todo;
                let todoDBObject = createDBObjectToDelete(tableName, {
                    "todo_id": todo_id,
                });
                await dbClient.delete(todoDBObject).promise();
            }
        });

    });

    context('update Todo tests', () => {

        it('correct input', async () => {
            const {Items: ItemsBefore} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            const itemToUpdate = ItemsBefore[0];
            const input = Object.assign(itemToUpdate, {"author": "Jakub"});

            const result =
                await fetch(URL + '/todo/update', {method: 'PATCH', body: JSON.stringify(input)})
                    .then(res => Promise.all([res.status, res.json()]));

            const {Items: ItemsAfter} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            const scannedItem = ItemsAfter.filter(o1 => o1['author'] === 'Jakub');

            expect(result[1].message).to.be.deep.equal("Todo updated!");
            expect(result[0]).to.be.deep.equal(HTTP_OK_WITH_CONTENT);
            expect(result[1].item.Attributes).to.include({"author": "Jakub"});
            expect(scannedItem[0]).to.include({"author": "Jakub"});
            expect(ItemsAfter).to.be.length(5);
        });

        it('empty field', async () => {
            const {Items} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            const itemToUpdate = Items[0];
            const input = Object.assign(itemToUpdate, {"author": ""});

            const result =
                await fetch(URL + '/todo/update', {method: 'PATCH', body: JSON.stringify(input)})
                    .then(res => Promise.all([res.status, res.json()]));

            expect(result[1].error).to.be.deep.equal("Empty fields: author");
            expect(result[1].message).to.be.deep.equal("Incorrect input");
            expect(result[0]).to.be.deep.equal(UNPROCESSABLE_ENTITY);
            expect(Items).to.be.length(5);
        });

        it('non existing object', async () => {
            const {Items} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            const itemToUpdate = Items[0];
            const toUpdate = {"todo_id": "123", "author": "Grzes"};
            const input = Object.assign({}, itemToUpdate, toUpdate);

            const result =
                await fetch(URL + '/todo/update', {method: 'PATCH', body: JSON.stringify(input)})
                    .then(res => Promise.all([res.status, res.json()]));

            expect(result[1].message).to.be.deep.equal("Todo could not be updated!");
            expect(result[1].error).to.be.deep.equal("Can not update non existing item");
            expect(result[0]).to.be.deep.equal(UNPROCESSABLE_ENTITY);
        });

        beforeEach(async () => {
            for (let singleMock of todoMock) {
                let todoJson = createTodoJSON(singleMock);
                let todoDBObject = createDBObjectToPut(tableName, todoJson);
                await dbClient.put(todoDBObject).promise();
            }
        });

        afterEach(async () => {
            const {Items} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            for (let todo of Items) {
                const {todo_id} = todo;
                let todoDBObject = createDBObjectToDelete(tableName, {
                    "todo_id": todo_id,
                });
                await dbClient.delete(todoDBObject).promise();
            }
        });

    });

    context('delete Todo tests', () => {

        it('correct input', async () => {
            const {Items: ItemsBefore} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            const itemToDelete = ItemsBefore[0];

            const result = await fetch(URL + '/todo/delete', {
                method: 'DELETE',
                body: JSON.stringify({"todo_id": itemToDelete['todo_id']})
            }).then(res => Promise.all([res.status, res.json()]));

            const {Items: ItemsAfter} = await dbClient.scan(createDBObjectToScan(tableName)).promise();

            expect(result[1].message).to.be.deep.equal("Todo deleted!");
            expect(result[0]).to.be.deep.equal(HTTP_OK_NO_CONTENT);
            expect(ItemsAfter).to.be.length(4);
        });

        it('wrong input', async () => {
            const result =
                await fetch(URL + '/todo/update', {
                    method: 'PATCH',
                    body: JSON.stringify({"todo_id": ""})
                })
                    .then(res => Promise.all([res.status, res.json()]));
            const {Items: ItemsAfter} = await dbClient.scan(createDBObjectToScan(tableName)).promise();

            expect(result[1].message).to.be.deep.equal("Incorrect input");
            expect(result[0]).to.be.deep.equal(UNPROCESSABLE_ENTITY);
            expect(ItemsAfter).to.be.length(5);
        });

        it('non existing object', async () => {
            const result = await fetch(URL + '/todo/delete', {
                method: 'DELETE',
                body: JSON.stringify({"todo_id": "test"})
            }).then(res => Promise.all([res.status, res.json()]));

            const {Items: ItemsAfter} = await dbClient.scan(createDBObjectToScan(tableName)).promise();

            expect(result[1].message).to.be.deep.equal("Todo could not be deleted!");
            expect(result[0]).to.be.deep.equal(UNPROCESSABLE_ENTITY);
            expect(ItemsAfter).to.be.length(5);
        });

        beforeEach(async () => {
            for (let singleMock of todoMock) {
                let todoJson = createTodoJSON(singleMock);
                let todoDBObject = createDBObjectToPut(tableName, todoJson);
                await dbClient.put(todoDBObject).promise();
            }
        });

        afterEach(async () => {
            const {Items} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            for (let todo of Items) {
                const {todo_id} = todo;
                let todoDBObject = createDBObjectToDelete(tableName, {
                    "todo_id": todo_id,
                });
                await dbClient.delete(todoDBObject).promise();
            }
        });

    });

    context('get single Todo tests', () => {

        it('correct input', async () => {
            const {Items} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            const singleItem = Items[0];
            const result = await fetch(`${URL}/todo/${singleItem['todo_id']}`, {
                method: 'GET'
            }).then(res => Promise.all([res.status, res.json()]));

            expect(result[1]['Item']).to.be.deep.equal(singleItem);
            expect(result[0]).to.be.deep.equal(HTTP_OK_WITH_CONTENT);
        });

        it('wrong input', async () => {
            const todo_id = "123";
            const {Items} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            const singleItem = Items[0];
            const result = await fetch(`${URL}/todo/${todo_id}`, {
                method: 'GET'
            }).then(res => Promise.all([res.status, res.json()]));

            expect(result[1]['message']).to.be.deep.equal("Todo does not exist");
            expect(result[1]['todo_id']).to.be.equal(todo_id);
            expect(result[0]).to.be.deep.equal(UNPROCESSABLE_ENTITY);
        });

        it('wrong input', async () => {
            const {Items: ItemsBefore} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            const itemToDelete = ItemsBefore[0];

            const result = await fetch(URL + '/todo/delete', {
                method: 'DELETE',
                body: JSON.stringify({"todo_id": "test"})
            }).then(res => Promise.all([res.status, res.json()]));

            const {Items: ItemsAfter} = await dbClient.scan(createDBObjectToScan(tableName)).promise();

            expect(result[1].message).to.be.deep.equal("Todo could not be deleted!");
            expect(result[0]).to.be.deep.equal(UNPROCESSABLE_ENTITY);
            expect(ItemsAfter).to.be.length(5);
        });

        beforeEach(async () => {
            for (let singleMock of todoMock) {
                let todoJson = createTodoJSON(singleMock);
                let todoDBObject = createDBObjectToPut(tableName, todoJson);
                await dbClient.put(todoDBObject).promise();
            }
        });

        afterEach(async () => {
            const {Items} = await dbClient.scan(createDBObjectToScan(tableName)).promise();
            for (let todo of Items) {
                const {todo_id} = todo;
                let todoDBObject = createDBObjectToDelete(tableName, {
                    "todo_id": todo_id,
                });
                await dbClient.delete(todoDBObject).promise();
            }
        });

    });

});