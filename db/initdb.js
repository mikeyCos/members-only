const { Client } = require("pg");
const { DATABASE_URL } = require("../config/environment");
const bcrypt = require("bcryptjs");

/*
 * Create a accounts table fullname, email, password, member
 * Create a posts table author, message, timestamp
 */

const accounts = [
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

const roles = [
  {
    name: "admin",
  },
  {
    name: "member",
  },
];

const posts = [
  {
    accountID: 1,
    body: "Ut est nisi, finibus at varius ac, aliquam nec erat. Fusce sit amet dignissim metus. Nulla facilisi. Nam rutrum ante sapien. Nulla maximus tortor sit amet dignissim efficitur. Vivamus pellentesque, eros id ullamcorper sagittis, enim mauris consectetur neque, a scelerisque erat ipsum in sapien",
  },
  {
    accountID: 1,
    body: "I like turtles",
  },
  {
    accountID: 1,
    body: "Ribbit ribbit",
  },
  {
    accountID: 2,
    body: "The answer to everything is 42",
  },
];

const populateAccountsTable = async (accountsArr, client) => {
  for (const account of accountsArr) {
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

const populateRolesTable = async (rolesArr, client) => {
  /*
   * Using CTE "WITH" clause
   * https://stackoverflow.com/questions/56147837/how-insert-data-to-parent-and-child-tables
   */
  for (const role of rolesArr) {
    const { name } = role;
    await client.query(
      `
      WITH insert_child AS (
        INSERT INTO roles (role_name)
        VALUES
          ($1)
        RETURNING id
      )
  
      INSERT INTO activation_keys VALUES
        ((SELECT id FROM insert_child),
          (SELECT
            UPPER(
              SUBSTRING (
                (SELECT gen_random_uuid()::text), '(([0-9a-z]{4}\\-){3}([0-9a-z]{4}))'
              )
            )
          )
        );
      `,
      [name]
    );
  }
};

const populatePostsTable = async (postsArr, client) => {
  for (const post of postsArr) {
    const { accountID, body } = post;
    await client.query(
      `
      INSERT INTO posts (account_id, body)
        VALUES ($1, $2)
      `,
      [accountID, body]
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

// As a group, account_id and role_id must be unique values; no duplicates
// https://neon.tech/postgresql/postgresql-tutorial/postgresql-unique-constraint#creating-a-unique-constraint-on-multiple-columns
const CREATE_USER_ROLES_TABLE_QUERY = `
  CREATE TABLE user_roles (
    account_id INTEGER,
    role_id INTEGER,
    UNIQUE(account_id, role_id),
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
  );
`;

const CREATE_ROLES_TABLE_QUERY = `
  CREATE TABLE roles (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    role_name VARCHAR ( 255 )
  );
`;

const CREATE_ACTIVATION_KEYS_QUERY = `
  CREATE TABLE activation_keys (
    role_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    activation_key VARCHAR ( 255 ) UNIQUE
  );
`;

// What is the appropriate size value for TEXT data type?
// What is 500 characters to bytes?
// Does this depend on the character encoder and programming language?
// Creating default values for timestamp columns
// https://neon.tech/postgresql/postgresql-tutorial/postgresql-timestamp#using-default-values-for-timestamp-columns
const CREATE_POSTS_TABLE_QUERY = `
  CREATE TABLE posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    account_id INTEGER,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    body TEXT
  );
`;

const DROP_TABLES = `
  DROP TABLE IF EXISTS accounts CASCADE;
  DROP TABLE IF EXISTS user_roles;
  DROP TABLE IF EXISTS roles CASCADE;
  DROP TABLE IF EXISTS activation_keys;
  DROP TABLE IF EXISTS posts;
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
  await client.query(CREATE_POSTS_TABLE_QUERY);
  await populateRolesTable(roles, client);
  await populateAccountsTable(accounts, client);
  await populatePostsTable(posts, client);
  await client.end();
};

initDB();
