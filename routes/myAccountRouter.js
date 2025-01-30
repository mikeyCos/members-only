const { Router } = require("express");
const {
  getManage,
  getMyAccount,
  getActivateKey,
  postActivateKey,
} = require("../controllers/myAccountController");

const myAccountRouter = new Router();

const isAuthenticated = (req, res, next) => {
  console.log("isAuthenticated running...");
  // If an account is logged in, redirect to the root
  if (!req.isAuthenticated()) return next({ status: 401 });
  next();
};

myAccountRouter.use(isAuthenticated);

// GET requests
// User must be logged in to use these routes
myAccountRouter.get("/", getMyAccount);
myAccountRouter.get("/:username/manage", getManage);
myAccountRouter.get("/:username/activate-key", getActivateKey);

// POST requests
myAccountRouter.post("/:username/activate-key", postActivateKey);

module.exports = myAccountRouter;
