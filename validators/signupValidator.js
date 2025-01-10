// https://express-validator.github.io/docs/api/check-schema/
const { checkSchema } = require("express-validator");
const { getAccount } = require("../db/queries");

const confirmPassword = (password, { req }) => {
  return password === req.body.password;
};

/*
 * Custom validators can be asynchronous
 * Return a Promise or throw a error
 * https://express-validator.github.io/docs/guides/customizing/#implementing-a-custom-validator
 */
const validateFullname = async (fullname) => {
  const regex = new RegExp("(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})");
};

const validateUsername = async (username) => {
  // Test against regex
  // Need to make sure user name is not taken
  const regex = new RegExp("^[a-zA-Z\\-\\_]{3,10}$");
  const account = await getAccount({ username });
  const regexResult = regex.test(username);
  // console.log("regex.test(username):", regex.test(username));
  // console.log("!account:", !account);
  // console.log("regexResult && !account:", regexResult && !account);
  // If regexResult and account are falsy values
  // Throw error or reject Promise
  if (!regexResult) throw new Error();
  if (account) throw new Error("Username taken.");
  return Promise.resolve();
};

const accountSchema = {
  fullname: {
    trim: true,
    isLength: {
      options: {
        max: 12,
      },
    },
    escape: true,
  },
  username: {
    trim: true,
    custom: {
      options: validateUsername,
    },
    errorMessage:
      "Username must be between 3 and 10 letters long. Dashes and underscores are the only acceptable symbols.",
    escape: true,
  },
  email: {
    trim: true,
    isEmail: true,
    errorMessage: "Invalid email address.",
    escape: true,
  },
  password: {
    trim: true,
    isStrongPassword: {
      options: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      },
    },
    isLength: {
      options: {
        max: 12,
      },
    },
    errorMessage:
      "Password must be between 8 and 12 characters long with at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.",
    escape: true,
  },
  "password-confirmation": {
    trim: true,
    custom: {
      options: confirmPassword,
    },
    errorMessage: "Passwords do not match.",
    escape: true,
  },
};

const validateSignup = checkSchema(accountSchema, ["body"]);

// Does rendering a response in a validation middleware make sense?
/* const validateAccount = [
  checkSchema(schema, ["body"]),
  (req, res, next) => {
    console.log("validateAccount running...");
    const errors = validationResult(req);
    console.log("errors:", errors);
    console.log("errors.mapped():", errors.mapped());
    if (!errors.isEmpty()) {
      return res.render("createAccount", {
        title: "Create Account",
        errors: errors.mapped(),
      });
    }

    next();
  },
]; */

module.exports = validateSignup;
