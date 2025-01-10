const supportController = {
  getSupport: async (req, res) => {
    res.render("support", { title: "Support" });
  },
};

module.exports = supportController;
