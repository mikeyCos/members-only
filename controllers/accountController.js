const { matchedData, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const validateSignup = require("../validators/signupValidator");
const validateLogin = require("../validators/loginValidator");
const { createAccount, getAccount } = require("../db/queries");

const accountController = {
  getLogin: asyncHandler(async (req, res) => {
    res.render("login");
  }),
  getLogout: asyncHandler(async (req, res) => {
    req.logout();
    res.redirect("/");
  }),
  getSignup: asyncHandler(async (req, res) => {
    res.render("signup");
  }),
  postLogin: [
    validateLogin,
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const inputs = matchedData(req, { onlyValidData: false });
      if (!errors.isEmpty()) {
        return res.render("login", {
          errors: errors.mapped(),
          inputs,
        });
      }

      next();
    }),
    (req, res, next) => {
      passport.authenticate("local", (err, account, info) => {
        if (err) return next(err);
        if (!account) {
          res.locals.message = info.message;
          // Redirect home(?)
          // Can I save the message to the session?
          return res.status(422).render("login");
        }

        return req.login(account, next);
      })(req, res, next);
    },
    (req, res) => {
      res.redirect("/my-account");
    },
  ],
  postLogout: (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  },
  postSignup: [
    validateSignup,
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const inputs = matchedData(req, { onlyValidData: false });

      if (!errors.isEmpty()) {
        return res.render("signup", {
          errors: errors.mapped(),
          inputs,
        });
      }

      next();
    }),
    asyncHandler(async (req, res, next) => {
      try {
        // Valid and sanitized data
        const { fullname, email, username, password } = matchedData(req);
        const hashedPassword = await bcrypt.hash(password, 10);

        await createAccount({
          fullname,
          email,
          username,
          password: hashedPassword,
        });

        const account = await getAccount({ username });

        // Automatically login after creating account
        req.login(account, (err) => {
          res.redirect("/");
        });
      } catch (err) {
        return next(err);
      }
    }),
  ],
};

module.exports = accountController;
