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

const activateRole = async ({ accountID, key }) => {
  // Need account_id
  // Need role_id
  await pool.query(
    `
    INSERT INTO user_roles ()
      VALUES ()
    `,
    [accountID, key]
  );
};

module.exports = {
  createAccount,
  getAccount,
};
