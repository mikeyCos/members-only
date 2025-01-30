const asyncHandler = require("express-async-handler");
const { matchedData, validationResult } = require("express-validator");
const validateKey = require("../validators/keyValidator");
const { assignUserRole } = require("../db/queries");

const myAccountController = {
  getMyAccount: asyncHandler(async (req, res) => {
    res.locals.profile = req.user;
    res.render("profile");
  }),
  getManage: asyncHandler(async (req, res) => {
    res.render("manageAccount");
  }),
  getActivateKey: asyncHandler(async (req, res) => {
    res.render("activateKey");
  }),
  postActivateKey: [
    validateKey,
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const inputs = matchedData(req, { onlyValidData: false });
      if (!errors.isEmpty()) {
        return res.render("activateKey", {
          errors: errors.mapped(),
          inputs,
        });
      }

      const { key } = inputs;
      const { id: accountID } = req.user;
      await assignUserRole({ accountID, key });
      next();
    }),
    asyncHandler(async (req, res) => {
      // Display success message?
      res.render("activateKey", { success: { msg: "Key activated" } });
    }),
  ],
};

module.exports = myAccountController;
