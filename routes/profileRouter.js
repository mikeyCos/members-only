const { Router } = require("express");
const {
  setProfile,
  getProfile,
  setProfileTab,
} = require("../controllers/profileController");

const profileRouter = new Router();

// Router-level
profileRouter.use("/:username/:tab?", [setProfile, setProfileTab]);

// GET requests
profileRouter.get("/:username/:tab?", getProfile);

module.exports = profileRouter;
