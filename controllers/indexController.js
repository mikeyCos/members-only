const asyncHandler = require("express-async-handler");
const { getAllMessages } = require("../db/queries");

const indexController = {
  getIndex: asyncHandler(async (req, res) => {
    console.log("getIndex running...");
    console.log("req.url", req.url);
    const messages = await getAllMessages();
    res.render("index", { title: "Home" });
  }),
};

module.exports = indexController;
