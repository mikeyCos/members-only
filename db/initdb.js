const { Client } = require("pg");
const { DATABASE_URL } = require("../config/environment");
const bcrypt = require("bcryptjs");

/*
 * Create a accounts table fullname, email, password, member
 * Create a messages table author, message, timestamp
 */

const accountsArr = [
  {
    fullname: "Bill Dauterive",
    email: "bill.d@gmail.com",
    username: "bill_dozer",
    password: "Test123!",
  },
  {
    fullname: "Kahn Souphanousinphone",
    email: "kahntheman@gmail.com",
    username: "kBanana",
    password: "Foobar2#",
  },
  {
    fullname: "Peggy Hill",
    email: "peggyTeaches@gmail.com",
    username: "spa-peggy",
    password: "inEspan456*",
  },
];

const populateAccountsTable = async (accounts, client) => {
  for (const account of accounts) {
    const { fullname, email, username, password } = account;
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      `
      INSERT INTO accounts (fullname, email, username, password)
        VALUES ($1, $2, $3, $4);
      `,
      [fullname, email, username, hashedPassword]
    );
  }
};

const CREATE_ACCOUNTS_TABLE_QUERY = `
  DROP TABLE IF EXISTS accounts;

  CREATE TABLE accounts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    fullname VARCHAR ( 255 ),
    email VARCHAR ( 255 ),
    username VARCHAR ( 255 ),
    password VARCHAR ( 255 )
  );
`;

const CREATE_USER_ROLES_TABLE_QUERY = `
  DROP TABLE IF EXISTS user_roles;

  CREATE TABLE user_roles (
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
  );
`;

const CREATE_ROLES_TABLE_QUERY = `
  DROP TABLE IF EXISTS roles;

  CREATE TABLE roles (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    role_name varchar ( 255 ),
    key varchar ( 255 )
  );
`;

const INSERT_ROLES_TABLE_QUERY = `
  INSERT INTO roles (role_name)
    VALUES
      ('admin'),
      ('member');
`;

// What is the appropriate size value for TEXT data type?
// What is 500 characters to bytes?
// Does this depend on the character encoder and programming language?
const CREATE_MESSAGES_TABLE_QUERY = `
  DROP TABLE IF EXISTS messages;

  CREATE TABLE messages (
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    message TEXT ( 32767 )
  );
`;

const initDB = async () => {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  await client.connect();
  await client.query(CREATE_ACCOUNTS_TABLE_QUERY);
  await populateAccountsTable(accountsArr, client);
  await client.end();
};

initDB();
