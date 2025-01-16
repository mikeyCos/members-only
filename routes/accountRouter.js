const { Router } = require("express");
const {
  getLogin,
  getSignup,
  getAccountPosts,
  postLogin,
  postLogout,
  postSignup,
} = require("../controllers/accountController.js");
/*
 * This router handles responsibilities for account actions
 * Current account actions include: login, logout, and create
 * How to prevent the user from going back to /create or /login if the user is already logged in?
 * Is this task more suited for the front-end versus the back-end?
 * Possible solution:
 * https://stackoverflow.com/questions/72376698/redirect-even-if-user-uses-back-button-node-js
 */
const accountRouter = new Router();

// GET requests
accountRouter.get("/login", getLogin);
accountRouter.get("/signup", getSignup);

// POST requests
accountRouter.post("/login", postLogin);
accountRouter.post("/logout", postLogout);
accountRouter.post("/signup", postSignup);

module.exports = accountRouter;
