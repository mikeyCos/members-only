const asyncHandler = require("express-async-handler");
const { matchedData, validationResult } = require("express-validator");
const validatePost = require("../validators/postValidator");
const { insertPost } = require("../db/queries");

const indexController = {
  getIndex: asyncHandler(async (req, res) => {
    console.log("getIndex running...");
    console.log("req.url", req.url);
    res.render("index");
  }),
  postIndex: [
    validatePost,
    asyncHandler(async (req, res, next) => {
      console.log("postIndex running...");
      const errors = validationResult(req);
      const inputs = matchedData(req, { onlyValidData: false });
      if (!errors.isEmpty()) {
        console.log(errors.mapped());
        console.log("inputs:", inputs);
        return res.render("index", {
          errors: errors.mapped(),
          inputs,
        });
      }

      next();
    }),
    asyncHandler(async (req, res) => {
      const { post: text } = matchedData(req);
      const { id: accountID } = req.user;
      await insertPost({ accountID, text });
      res.redirect("/");
    }),
  ],
};

module.exports = indexController;
