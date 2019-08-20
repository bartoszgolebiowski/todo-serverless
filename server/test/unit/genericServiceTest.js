const mocha = require('mocha');
const {expect} = require('chai');
const {describe} = require("mocha");
const {validateInput, emptyFieldsError} = require('../../src/utils/genericService');

describe('genericService tests', () => {
    context('validateInput tests', () => {
        it('correct input', () => {
            const input = {
                "name": "Naucz sie nodejs!"
            };

            const result = validateInput(input);

            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(0);
            expect(result).to.deep.equal([]);
        });
        it('should return array with name of empty field', () => {
            const input = {
                "name": "",
            };

            const result = validateInput(input);

            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(1);
            expect(result).to.deep.equal(['name']);
        });
        it('should return array with names of empty fields', () => {
            const input = {
                "name": "",
                "creator": "",
            };

            const result = validateInput(input);

            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(2);
            expect(result).to.deep.equal(['name', 'creator']);
        });
    });
    context('emptyFieldsError tests', () => {
        it('should return error message with names of empty fields ', () => {
            const input = ['name'];
            const result = emptyFieldsError(input);

            expect(result).to.deep.equal({"message":"Incorrect input", "error": "Empty fields: name"});
        });
    });
});
