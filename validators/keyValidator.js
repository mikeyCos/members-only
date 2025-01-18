const { checkSchema } = require("express-validator");
const { getRoleKey } = require("../db/queries");

const keyValidator = async (key) => {};

const keySchema = {
  key: {
    trim: true,
    isEmpty: {
      negated: true,
    },
    errorMessage: "Key cannot be empty.",
    custom: {
      options: keyValidator,
    },
    escape: true,
  },
};

const validateKey = checkSchema(keySchema, ["body"]);

module.exports = validateKey;
