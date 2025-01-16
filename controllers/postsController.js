const asyncHandler = require("express-async-handler");

const postsController = {
  getPosts: asyncHandler((req, res) => {}),
  getAccountPosts: asyncHandler(async (req, res) => {
    // Show all posts corresponding to the req.params.username
  }),
};

module.exports = postsController;
