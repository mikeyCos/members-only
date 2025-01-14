const asyncHandler = require("express-async-handler");

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
  getActivate: asyncHandler(async (req, res) => {
    console.log("getActivate running...");
    res.render("activateAccount");
  }),
};

module.exports = myAccountController;
