const { Router } = require("express");
const {
  getManage,
  getMyAccount,
  getActivate,
} = require("../controllers/myAccountController");

const myAccountRouter = new Router();

// Get requests
myAccountRouter.get("/", getMyAccount);
myAccountRouter.get("/:username/manage", getManage);
myAccountRouter.get("/:username/activate", getActivate);

module.exports = myAccountRouter;
