const { checkSchema } = require("express-validator");

const postSchema = {
  post: {
    trim: true,
    isEmpty: {
      negated: true,
    },
    errorMessage: "Test",
    escape: true,
  },
};

const validatePost = checkSchema(postSchema, ["body"]);

module.exports = validatePost;
