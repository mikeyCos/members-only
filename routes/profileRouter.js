const { Router } = require("express");
const {
  setProfile,
  getProfile,
  getProfilePosts,
  setProfileTab,
} = require("../controllers/profileController");
const hasRole = require("../utils/hasRole");
const validateProfileTab = require("../validators/profileTabValidator");

const profileRouter = new Router();

const checkRole = (req, res, next) => {
  const userID = req.user?.id;
  const profileID = res.locals.profile.id;
  if (userID === profileID || hasRole(req.user?.roles, ["admin", "member"])) {
    return next();
  }

  next({ status: 403, msg: "You do not have permissions to view resource." });
};

// Router-level
profileRouter.use("/view-profile/:username/:tab?", [
  validateProfileTab,
  setProfile,
  setProfileTab,
]);
profileRouter.use("/view-posts/:username", [setProfile, checkRole]);

// GET requests
profileRouter.get("/view-profile/:username/:tab?", getProfile);
profileRouter.get("/view-posts/:username", getProfilePosts);

module.exports = profileRouter;
