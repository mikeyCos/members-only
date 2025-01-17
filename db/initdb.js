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

const rolesArr = [
  {
    name: "admin",
    key: "pitaya",
  },
  {
    name: "member",
    key: "toucan",
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

const populateRolesTable = async (roles, client) => {
  /*
   * Using CTE "WITH" clause
   * https://stackoverflow.com/questions/56147837/how-insert-data-to-parent-and-child-tables
   */
  for (const role of roles) {
    const { name, key } = role;
    await client.query(
      `
      WITH insert_child AS (
        INSERT INTO roles (role_name)
        VALUES
          ($1)
        RETURNING id
      )
  
      INSERT INTO activation_keys VALUES
      ((SELECT id FROM insert_child), $2);
      `,
      [name, key]
    );
  }
};

const CREATE_ACCOUNTS_TABLE_QUERY = `
  CREATE TABLE accounts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    fullname VARCHAR ( 255 ),
    email VARCHAR ( 255 ),
    username VARCHAR ( 255 ),
    password VARCHAR ( 255 )
  );
`;

const CREATE_USER_ROLES_TABLE_QUERY = `
  CREATE TABLE user_roles (
    account_id INTEGER,
    role_id INTEGER,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
  );
`;

const CREATE_ROLES_TABLE_QUERY = `
  CREATE TABLE roles (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    role_name varchar ( 255 )
  );
`;

const CREATE_ACTIVATION_KEYS_QUERY = `
  CREATE TABLE activation_keys (
    role_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    activation_key varchar ( 255 )
  );
`;

// What is the appropriate size value for TEXT data type?
// What is 500 characters to bytes?
// Does this depend on the character encoder and programming language?
const CREATE_MESSAGES_TABLE_QUERY = `
  CREATE TABLE messages (
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    message TEXT ( 32767 )
  );
`;

const foo = `
  INSERT INTO user_roles (account_id, role_id)
    VALUES ((SELECT id FROM accounts WHERE id = 2), (SELECT role_id FROM activation_keys WHERE activation_key = 'toucan'));
`;

const DROP_TABLES = `
  DROP TABLE IF EXISTS accounts CASCADE;
  DROP TABLE IF EXISTS user_roles;
  DROP TABLE IF EXISTS roles CASCADE;
  DROP TABLE IF EXISTS activation_keys;
  DROP TABLE IF EXISTS messages;
`;

const initDB = async () => {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  await client.connect();
  await client.query(DROP_TABLES);
  await client.query(CREATE_ACCOUNTS_TABLE_QUERY);
  await client.query(CREATE_ROLES_TABLE_QUERY);
  await client.query(CREATE_USER_ROLES_TABLE_QUERY);
  await client.query(CREATE_ACTIVATION_KEYS_QUERY);
  await populateRolesTable(rolesArr, client);
  await populateAccountsTable(accountsArr, client);
  await client.end();
};

initDB();
