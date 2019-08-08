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

    return {"error": "Empty fields: " + emptyFields.join(", ")};
};

module.exports = {
    response: response,
    validateInput: validateInput,
    emptyFieldsError: emptyFieldsError,
};