const pool = require("./pool");

const createAccount = async ({ fullname, email, username, password }) => {
  console.group("createAccount query running...");
  await pool.query(
    `
    INSERT INTO accounts (fullname, email, username, password)
      VALUES ($1, $2, $3, $4);
    `,
    [fullname, email, username, password]
  );
};

const getAccount = async ({ username, id }) => {
  console.log("getAccount query running...");
  console.log("username:", username);
  console.log("id:", id);

  const {
    rows: [account],
  } = await pool.query(
    `
    SELECT * FROM accounts
      WHERE username = $1 OR id = $2
    `,
    [username, id]
  );
  console.log("getAccount return value:", account);
  return account;
};

const getRoleKey = async ({ key }) => {
  const {
    rows: [roleKey],
  } = await pool.query(
    `
    SELECT EXISTS
      (SELECT 1 FROM activation_keys
        WHERE activation_key = $1
      )::integer;
    `,
    [key]
  );

  return roleKey;
};

const assignUserRole = async ({ accountID, key }) => {
  // Key could be the following formats:
  // XXXX-XXXX-XXXX-XXXX, XXXXXXXXXXXXX, or XXXX XXXX XXXX XXXX

  // Works for XXXX-XXXX-XXXX-XXXX and XXXX XXXX XXXX XXXX
  // SELECT REGEXP_REPLACE('A591 B8CB 4FF0 B3C6', '([^0-9A-Z]+)', '-', 'g');
  // SELECT UNNEST(REGEXP_MATCHES('A591-B8CB-4FF0-B3C6', '([0-9A-Z]{4})', 'g'));

  // Works for XXXXXXXXXXXX
  // SELECT REGEXP_REPLACE('A591B8CB4FF0B3C6', '([0-9A-Z]{4})([0-9A-Z]{4})([0-9A-Z]{4})([0-9A-Z]{4})', '\1-\2-\3-\4');

  // SELECT * FROM activation_keys WHERE REPLACE(REPLACE(activation_key, '-', ''), ' ', '') = (SELECT REGEXP_REPLACE('A591B8CB4FF0B3C6', '([^0-9A-Z]+)', '', 'g'));
  await pool.query(
    `
    INSERT INTO user_roles (account_id, role_id)
      VALUES
        ((SELECT id FROM accounts WHERE id = $1),
        (SELECT role_id FROM activation_keys
          WHERE REPLACE(
            REPLACE(activation_key, '-', ''), ' ', '') =
            (SELECT REGEXP_REPLACE($2, '([^0-9A-Z]+)', '', 'g'))
          )
        );
    `,
    [accountID, key]
  );
};

module.exports = {
  createAccount,
  getAccount,
  getRoleKey,
  assignUserRole,
};
