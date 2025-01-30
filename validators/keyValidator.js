const { checkSchema } = require("express-validator");
const { keyExists } = require("../db/queries");

const keyFormatValidator = (key) => {
  const regex = new RegExp("([A-Z0-9]{4}(?:[- ]?[A-Z0-9]{4}){3})");
  return regex.test(key);
};

const keyValidator = async (key, { req }) => {
  const { id: accountID } = req.user;
  const result = await keyExists({ accountID, key });

  if (!result) throw new Error();

  return Promise.resolve();
};

const keySanitizer = (initialKey) => {
  /* This sanitizer will only run if the previous validator passes
   * This will sanitized key to XXXX-XXXX-XXXX-XXXX
   * XXXXXXXXXXXXX, or XXXX XXXX XXXX XXXX => XXXX-XXXX-XXXX-XXXX
   */
  const regex = new RegExp("[0-9A-Z]{4}", "g");
  const sanitizedKey = initialKey.match(regex).join("-");
  return sanitizedKey;
};

/* const pattern = new RegExp('([A-Z0-9]{4}(?:[- ]?[A-Z0-9]{4}){3})');
 * Test string is one of three formats: XXXX-XXXX-XXXX-XXXX, XXXXXXXXXXXXX, or XXXX XXXX XXXX XXXX
 * If test returns true
 *  Continue with validation
 * Else
 *  Break out of validation
 * Sanitize string to the format XXXX-XXXX-XXXX-XXXX before validating against the database
 */
const keySchema = {
  key: {
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "Key cannot be empty.",
    },
    isFormat: {
      custom: keyFormatValidator,
      bail: true,
    },
    customSanitizer: {
      options: keySanitizer,
    },
    isValid: {
      custom: keyValidator,
    },
    errorMessage: "Invalid key.",
    escape: true,
  },
};

const validateKey = checkSchema(keySchema, ["body"]);

module.exports = validateKey;
