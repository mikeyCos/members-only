const { query } = require("express");
const pool = require("./pool");

const createAccount = async ({ fullname, email, username, password }) => {
  await pool.query(
    `
    INSERT INTO accounts (fullname, email, username, password)
      VALUES ($1, $2, $3, $4);
    `,
    [fullname, email, username, password]
  );
};

const getAccount = async ({ id, username }) => {
  // https://stackoverflow.com/questions/55375533/postgresql-how-to-join-tables-on-array-column
  // https://stackoverflow.com/questions/12808189/setting-column-values-as-column-names-in-the-sql-query-result
  const {
    rows: [account],
  } = await pool.query(
    `
    SELECT *,
    (SELECT ARRAY_AGG(role_name) FROM roles
      WHERE roles.id = ANY(SELECT role_id FROM user_roles WHERE account_id = accounts.id)
    ) AS roles
    FROM accounts WHERE id = $1 OR username = $2;
    `,
    [id, username]
  );

  return account;
};

const keyExists = async ({ accountID, key }) => {
  // If key exists in activation_keys table
  //  If account has role return 0
  //  Else return 1
  // Else Return 0
  // Should this query be separated? In other words, one query for keys, and one query for roles.
  const {
    rows: [{ exists }],
  } = await pool.query(
    `
    SELECT
    CASE
      WHEN
        (SELECT EXISTS(SELECT * FROM activation_keys WHERE activation_key = $2))
      THEN
        (SELECT
          CASE
            WHEN
              (SELECT EXISTS(SELECT * FROM activation_keys
              LEFT JOIN user_roles ON user_roles.role_id = activation_keys.role_id
              WHERE activation_key = $2 AND account_id = $1))
            THEN 0
            ELSE 1
          END)
      ELSE 0
    END AS exists;
    `,
    [accountID, key]
  );

  return exists;
};

const assignUserRole = async ({ accountID, key }) => {
  /* Original query
   * INSERT INTO user_roles (account_id, role_id)
   *  VALUES
   *    ((SELECT id FROM accounts WHERE id = $1),
   *    (SELECT role_id FROM activation_keys
   *      WHERE (SELECT REGEXP_REPLACE(activation_key, '([^0-9A-Z]+)', '', 'g')) =
   *        (SELECT REGEXP_REPLACE($2, '([^0-9A-Z]+)', '', 'g'))
   *      )
   *    );
   */
  // SELECT REGEXP_REPLACE(activation_key, '([^0-9A-Z]+)', '', 'g')
  // vs
  // SELECT TRANSLATE(activation_key, '-', '')
  await pool.query(
    `
    INSERT INTO user_roles (account_id, role_id)
      VALUES
        ((SELECT id FROM accounts WHERE id = $1),
        (SELECT role_id FROM activation_keys
          WHERE activation_key = $2
        ));
    `,
    [accountID, key]
  );
};

const insertPost = async ({ accountID, text }) => {
  await pool.query(
    `
    INSERT INTO posts (account_id, body)
      VALUES ($1, $2)
    `,
    [accountID, text]
  );
};

const getAccountPosts = async ({ accountID }) => {
  const { rows: accountPosts } = await pool.query(
    `
    SELECT posts.id AS post_id, account_id, username, body, created_at FROM posts
      LEFT JOIN accounts ON accounts.id = account_id
      WHERE account_id = $1
      ORDER BY created_at DESC;
    `,
    [accountID]
  );

  return accountPosts;
};

const getAllPosts = async () => {
  const { rows: posts } = await pool.query(
    `
    SELECT posts.id AS post_id, account_id, username, body, created_at FROM posts
      LEFT JOIN accounts ON accounts.id = account_id
      ORDER BY created_at DESC;
    `
  );

  return posts;
};

const deletePost = async ({ accountID, postID }) => {
  await pool.query(
    `
    DELETE FROM posts
      WHERE account_id = $1 AND id = $2
    `,
    [accountID, postID]
  );
};

module.exports = {
  createAccount,
  getAccount,
  keyExists,
  assignUserRole,
  insertPost,
  getAccountPosts,
  getAllPosts,
  deletePost,
};
