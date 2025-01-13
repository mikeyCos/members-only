const { matchedData, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const validateSignup = require("../validators/signupValidator");
const validateLogin = require("../validators/loginValidator");
const { createAccount, getAccount } = require("../db/queries");

const accountController = {
  getLogin: asyncHandler(async (req, res) => {
    console.log("getLogin running...");
    res.render("login");
  }),
  getLogout: asyncHandler(async (req, res) => {
    req.logout();
    res.redirect("/");
  }),
  getSignup: asyncHandler(async (req, res) => {
    console.log("getSignup running...");
    console.log("req.user:", req.user);
    res.render("signup");
  }),
  postLogin: [
    validateLogin,
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const inputs = matchedData(req, { onlyValidData: false });
      if (!errors.isEmpty()) {
        console.log(errors.mapped());
        return res.render("login", {
          errors: errors.mapped(),
          inputs,
        });
      }

      next();
    }),
    (req, res, next) => {
      console.log("postLogin running...");
      console.log("req.body:", req.body);
      passport.authenticate("local", (err, account, info) => {
        console.log("authenticating...");
        console.log("err:", err);
        console.log("account:", account);
        console.log("info:", info);
        if (err) return next(err);
        if (!account) {
          res.locals.message = info.message;
          // Redirect home(?)
          // Can I save the message to the session?
          return res.status(422).render("login");
        }

        console.log("req.login called...");
        return req.login(account, next);
      })(req, res, next);
    },
    (req, res) => {
      console.log("postLogin running after authentication....");
      res.redirect("/");
    },
  ],
  postLogout: (req, res, next) => {
    console.log("postLogout running...");
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  },
  postSignup: [
    validateSignup,
    asyncHandler(async (req, res, next) => {
      console.log("postSignup running after validateAccount...");
      const errors = validationResult(req);
      const inputs = matchedData(req, { onlyValidData: false });

      if (!errors.isEmpty()) {
        console.log("errors.mapped():", errors.mapped());
        console.log("inputs:", inputs);
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
        /* bcrypt.hash(password, 10, async (err, hashedPassword) => {
          if (err) return next(err);
          await createAccount({
            fullname,
            email,
            username,
            password: hashedPassword,
          });
          const account = await getAccount({ username });
          console.log("account:", account);

          // Automatically login after creating account
          req.login(account, (err) => {
            console.log("login running after creating account...");
            res.redirect("/");
          });
        }); */
        const hashedPassword = await bcrypt.hash(password, 10);
        await createAccount({
          fullname,
          email,
          username,
          password: hashedPassword,
        });

        const account = await getAccount({ username });
        console.log("account:", account);

        // Automatically login after creating account
        req.login(account, (err) => {
          console.log("login running after creating account...");
          res.redirect("/");
        });
      } catch (err) {
        return next(err);
      }
    }),
  ],
};

module.exports = accountController;
