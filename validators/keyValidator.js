const { checkSchema } = require("express-validator");

const keySchema = {
  key: {
    trim: true,
    isEmpty: {
      negated: true,
    },
    errorMessage: "Key cannot be empty.",
    escape: true,
  },
};

const validateKey = checkSchema(keySchema, ["body"]);

module.exports = validateKey;
