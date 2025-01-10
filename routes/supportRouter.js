const { Router } = require("express");
const { getSupport } = require("../controllers/supportController");

const supportRouter = new Router();

supportRouter.get("/", getSupport);

module.exports = supportRouter;
