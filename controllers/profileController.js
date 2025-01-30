const asyncHandler = require("express-async-handler");
const { getAccount, getAccountPosts } = require("../db/queries");

const profileController = {
  setProfile: asyncHandler(async (req, res, next) => {
    // Sets res.locals.profile to the account based on req.params.username
    console.log("setProfile running...");
    const { username } = req.params;
    const profile = await getAccount({ username });
    if (!profile) next({ status: 404, msg: "Profile not found" });

    res.locals.profile = profile;
    next();
  }),
  getProfile: asyncHandler(async (req, res) => {
    console.log("getProfile running...");
    res.render("profile");
  }),
  getProfilePosts: asyncHandler(async (req, res) => {
    // Show all posts corresponding to the req.params.username
    // Do not
    console.log("getProfilePosts running...");
    const { id: accountID } = res.locals.profile;
    const posts = await getAccountPosts({ accountID });
    console.log("res.locals.currentUser:", res.locals.currentUser);
    console.log("posts:", posts);
    console.log(res.locals.currentUser.id === posts[0].account_id);
    res.render("accountPosts", { posts });
  }),
  setProfileTab: asyncHandler(async (req, res, next) => {
    console.log("switchProfileTab running...");
    // const tab = req.params.tab ?? "overview";
    const tab = req.params.tab;
    if (tab) res.locals.profileTab = tab;
    next();
  }),
};

module.exports = profileController;
