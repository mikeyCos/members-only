const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DBUSER}:${process.env.DBPASSWORD}@localhost:5432/${process.env.DBNAME}`,
};
