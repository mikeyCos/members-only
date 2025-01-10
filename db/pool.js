const { Pool } = require("pg");
const { DATABASE_URL } = require("../config/environment");

const pool = new Pool({
  connectionString: DATABASE_URL,
});

module.exports = pool;
