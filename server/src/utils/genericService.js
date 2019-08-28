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

    return {"message": "Incorrect input", "error": "Empty fields: " + emptyFields.join(", ")};
};

const createDBObjectToUpdate = (tableName, input, id) => {
    const {attributeValues, attributeNames, updateExpression,} = createUpdateFields(input, id);
    return {
        TableName: tableName,
        Key: id,
        UpdateExpression: attributeValues,
        ExpressionAttributeValues: updateExpression,
        ExpressionAttributeNames: attributeNames,
        ReturnValues: "UPDATED_NEW"
    };
};

const createUpdateFields = (input, idJson) => {
    const id = Object.keys(idJson)[0];
    const fields = Object.keys(input).filter(o1 => o1 !== id);
    const attributeValues = createAttributeValues(fields);

    let updateExpression = {};
    fields.forEach(field => updateExpression[`:${field}att`] = input[field]);

    let attributeNames = {};
    fields.forEach(field => attributeNames[`#${field}att`] = field);

    return {attributeValues, attributeNames, updateExpression};
};

const createAttributeValues = (fields) => {
    const equation = fields.map(field => `#${field}att=:${field}att`);
    const attributeValues = equation.join(", ");
    return "set " + attributeValues;
};

module.exports = {
    response: response,
    validateInput: validateInput,
    emptyFieldsError: emptyFieldsError,
    createDBObjectToUpdate: createDBObjectToUpdate,
};