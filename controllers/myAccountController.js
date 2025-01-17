const asyncHandler = require("express-async-handler");
const { matchedData, validationResult } = require("express-validator");
const validateKey = require("../validators/keyValidator");

const myAccountController = {
  getMyAccount: asyncHandler(async (req, res) => {
    console.log("getMyAccount running...");
    res.locals.profile = req.user;
    res.render("profile");
  }),
  getManage: asyncHandler(async (req, res) => {
    console.log("getManage running...");
    res.render("manageAccount");
  }),
  getActivateKey: asyncHandler(async (req, res) => {
    console.log("getActivate running...");
    res.render("activateKey");
  }),
  postActivateKey: [
    validateKey,
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const inputs = matchedData(req, { onlyValidData: false });
      if (!errors.isEmpty()) {
        console.log(errors.mapped());
        console.log("inputs:", inputs);
        return res.render("activateKey", {
          errors: errors.mapped(),
          inputs,
        });
      }

      next();
    }),
    asyncHandler(async (req, res) => {
      // Display success message?
      console.log("req.user:", req.user);
      console.log("res.locals.currentUser:", res.locals.currentUser);
      res.render("activateKey", { success: "Key activated" });
    }),
  ],
};

module.exports = myAccountController;
