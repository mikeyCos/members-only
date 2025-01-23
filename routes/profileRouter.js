const { Router } = require("express");
const {
  setProfile,
  getProfile,
  getProfilePosts,
  setProfileTab,
} = require("../controllers/profileController");

const profileRouter = new Router();

// Router-level
profileRouter.use("/view-profile/:username/:tab?", [setProfile, setProfileTab]);
profileRouter.use("/view-posts/:username", setProfile);

// GET requests
profileRouter.get("/view-profile/:username/:tab?", getProfile);
profileRouter.get("/view-posts/:username", getProfilePosts);

module.exports = profileRouter;
