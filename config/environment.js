const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3000,
  // DATABASE_URL: process.env.DATABASE_URL, // Use for production
  DATABASE_URL: `postgresql://${process.env.DBUSER}:${process.env.DBPASSWORD}@localhost:5432/${process.env.DBNAME}`, // Use for development
};
