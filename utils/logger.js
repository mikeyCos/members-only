const logger = (req, res, next) => {
  console.log("Logger running...");
  console.log("req.originalUrl:", req.originalUrl);
  next();
};

module.exports = logger;
