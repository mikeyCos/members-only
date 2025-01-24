const { Router } = require("express");
const {
  setProfile,
  getProfile,
  getProfilePosts,
  setProfileTab,
} = require("../controllers/profileController");
const hasRole = require("../utils/hasRole");

const profileRouter = new Router();

const checkRole = (req, res, next) => {
  console.log("checkRole running...");
  console.log("req.user:", req.user);
  console.log("res.locals.profile:", res.locals.profile);

  const userID = req.user?.id;
  const profileID = res.locals.profile.id;
  if (userID === profileID || hasRole(req.user?.roles, ["admin", "member"])) {
    return next();
  }

  next({ msg: "You do not have permissions to view resource." });
};

// Router-level
profileRouter.use("/view-profile/:username/:tab?", [setProfile, setProfileTab]);
profileRouter.use("/view-posts/:username", [setProfile, checkRole]);

// GET requests
profileRouter.get("/view-profile/:username/:tab?", getProfile);
profileRouter.get("/view-posts/:username", getProfilePosts);

module.exports = profileRouter;
