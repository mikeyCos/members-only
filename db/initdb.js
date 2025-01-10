const { Client } = require("pg");
const { DATABASE_URL } = require("../config/environment");

const CREATE_ACCOUNTS_TABLE_QUERY = `
DROP TABLE IF EXISTS accounts;

CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 ),
  password VARCHAR ( 255 )
);
`;

const initDB = async () => {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  await client.connect();
  await client.query(CREATE_ACCOUNTS_TABLE_QUERY);
  await client.end();
};

initDB();
