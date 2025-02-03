const { checkSchema } = require("express-validator");

/* Do not need to escape
 * The data is not being concatenated to a query
 * https://node-postgres.com/features/queries#parameterized-query
 */
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
  },
};

const validatePost = checkSchema(postSchema, ["body"]);

module.exports = validatePost;
