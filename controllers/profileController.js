const asyncHandler = require("express-async-handler");
const { getAccount, getAccountPosts } = require("../db/queries");

const profileController = {
  setProfile: asyncHandler(async (req, res, next) => {
    // Sets res.locals.profile to the account based on req.params.username
    const { username } = req.params;
    const profile = await getAccount({ username });
    if (!profile) next({ status: 404, msg: "Profile not found" });

    res.locals.profile = profile;
    next();
  }),
  getProfile: asyncHandler(async (req, res) => {
    res.render("profile");
  }),
  getProfilePosts: asyncHandler(async (req, res) => {
    // Show all posts corresponding to the req.params.username
    console.log("req.baseUrl:", req.baseUrl);
    console.log("req.path:", req.path);
    const { id: accountID } = res.locals.profile;
    const posts = await getAccountPosts({ accountID });
    res.render("accountPosts", { posts });
  }),
  setProfileTab: asyncHandler(async (req, res, next) => {
    const tab = req.params.tab;
    if (tab) res.locals.profileTab = tab;
    next();
  }),
};

module.exports = profileController;
