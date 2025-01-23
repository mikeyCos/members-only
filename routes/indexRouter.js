const { Router, application } = require("express");
const { getIndex, postIndex } = require("../controllers/indexController");
const { getAllPosts } = require("../db/queries");

const indexRouter = new Router();

indexRouter.use(async (req, res, next) => {
  const posts = await getAllPosts();
  res.locals.posts = posts;
  next();
});

indexRouter.get("/", getIndex);

indexRouter.post("/", postIndex);

module.exports = indexRouter;
