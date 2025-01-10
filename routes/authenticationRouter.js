const { Router } = require("express");
const {
  getLogin,
  getSignup,
  postLogin,
  postLogout,
  postSignup,
} = require("../controllers/authenticationController");

/*
 * This router handles responsibilities for account actions
 * Current account actions include: login, logout, and create
 * How to prevent the user from going back to /create or /login if the user is already logged in?
 * Is this task more suited for the front-end versus the back-end?
 * Possible solution:
 * https://stackoverflow.com/questions/72376698/redirect-even-if-user-uses-back-button-node-js
 */
const authenticationRouter = new Router();

const isAuthenticated = (req, res, next) => {
  console.log("isAuthenticated running...");
  // If an account is logged in, redirect to the root
  if (req.isAuthenticated()) return res.redirect("/");
  next();
};

// GET requests
authenticationRouter.get("/login", getLogin);
authenticationRouter.get("/signup", getSignup);

// POST requests
authenticationRouter.post("/login", postLogin);
authenticationRouter.post("/logout", postLogout);
authenticationRouter.post("/signup", postSignup);

module.exports = authenticationRouter;
