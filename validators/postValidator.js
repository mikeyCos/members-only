const { checkSchema } = require("express-validator");

const postSchema = {
  post: {
    trim: true,
    isEmpty: {
      negated: true,
    },
    isLength: {
      options: { min: 1, max: 560 },
    },
    errorMessage: "Post must be between 1 and 560 characters long.",
    escape: true,
  },
};

const validatePost = checkSchema(postSchema, ["body"]);

module.exports = validatePost;
