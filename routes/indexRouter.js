const { Router, application } = require("express");
const {
  setAllPosts,
  getIndex,
  postIndex,
  postDeletePost,
} = require("../controllers/indexController");

const indexRouter = new Router();

// GET requests
indexRouter.get("/", [setAllPosts, getIndex]);

// POST requests
indexRouter.post("/", [setAllPosts, postIndex]);
indexRouter.post("/post/:postID/:accountID/delete", postDeletePost);

module.exports = indexRouter;
