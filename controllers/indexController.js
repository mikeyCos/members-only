const asyncHandler = require("express-async-handler");
const { matchedData, validationResult } = require("express-validator");
const validatePost = require("../validators/postValidator");
const { insertPost, getAllPosts, deletePost } = require("../db/queries");

const indexController = {
  setAllPosts: asyncHandler(async (req, res, next) => {
    const posts = await getAllPosts();
    res.locals.posts = posts;
    next();
  }),
  getIndex: asyncHandler(async (req, res) => {
    res.render("index");
  }),
  postIndex: [
    validatePost,
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const inputs = matchedData(req, { onlyValidData: false });
      if (!errors.isEmpty()) {
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
  postDeletePost: asyncHandler(async (req, res) => {
    const { postID, accountID } = req.params;
    await deletePost({ accountID, postID });
    res.redirect("/");
  }),
};

module.exports = indexController;
