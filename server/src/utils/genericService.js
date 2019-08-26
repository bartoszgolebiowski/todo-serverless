const response = (statusCode, message) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify(message, null, 2),
    };
};
const validateInput = (input) => {
    return Object
        .keys(input)
        .filter(o1 => input[o1] === "")
};
const emptyFieldsError = (inputErrors) => {
    const emptyFields = [];

    for (let i in inputErrors) {
        emptyFields.push(inputErrors[i]);
    }

    return {"message":"Incorrect input", "error": "Empty fields: " + emptyFields.join(", ")};
};

const createDBObjectToUpdate = (tableName, input) => {
    const {todo_id} = input;
    const {attributeValues, updateExpression} = createUpdateFields(input);

    return {
        TableName: tableName,
        Key: {todo_id},
        UpdateExpression: attributeValues,
        ExpressionAttributeValues: updateExpression,
        ReturnValues: "UPDATED_NEW"
    };
};

const createUpdateFields = (input) => {
    const {todo_id} = input;
    const fields = Object.keys(input).filter(o1 => o1 !== todo_id);
    const attributeValues = createAttributeValues(fields);

    let updateExpression = {};
    fields.forEach(field => updateExpression[`:${field}`] = input[field]);
    console.log(attributeValues, updateExpression)
    return {attributeValues, updateExpression};
};

const createAttributeValues = (fields) => {
    const equation = fields.map(field => `${field} = :${field}`);
    const attributeValues = equation.join(", ");
    return "set " + attributeValues;
};

module.exports = {
    response: response,
    validateInput: validateInput,
    emptyFieldsError: emptyFieldsError,
    createDBObjectToUpdate: createDBObjectToUpdate,
};