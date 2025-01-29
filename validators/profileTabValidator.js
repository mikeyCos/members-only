const { checkSchema, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const fs = require("fs/promises");
const { existsSync } = require("fs");
const { viewsPartialsPath } = require("../paths/paths");

const profileTabValidator = async (tab) => {
  console.log("profileTabValidator running...");
  const tabPath = `${viewsPartialsPath}/profileTabs/${tab}.ejs`;

  // I need to review promises
  const tabExists = await fs
    .access(tabPath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);

  console.log("tabPath:", tabPath);
  console.log("tabExists:", tabExists);
  if (!tabExists) throw new Error();
  return Promise.resolve();
};

const profileTabSchema = {
  tab: {
    trim: true,
    custom: {
      options: profileTabValidator,
    },
    optional: { options: { nullable: true } },
    errorMessage: "Invalid tab.",
    escape: true,
  },
};

const validateProfileTab = asyncHandler(async (req, res, next) => {
  console.log("validateProfileTab running...");
  await checkSchema(profileTabSchema, ["params"]).run(req);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next({ status: 404, msg: "Resource not found" });
  }

  next();
});

module.exports = validateProfileTab;
