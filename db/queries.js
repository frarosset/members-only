const pool = require("./pool.js");
const { securePasswordForStorage } = require("../utils/passwordUtils.js");

const db = { create: {}, read: {}, update: {}, delete: {} };

// Create a user
// Input: data (object with username, password (plain-text), name, surname)
// The password is secured before being stored on the db
db.create.user = async (data) => {
  const passwordhash = await securePasswordForStorage(data.password);

  const sql =
    "INSERT INTO users (username, passwordhash, name, surname, signup_date) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id;";
  const sqlData = [data.username, passwordhash, data.name, data.surname];

  const results = await pool.query(sql, sqlData);

  return results.rows[0].id;
};

db.read.userFromId = async (id) => {
  const sql = "SELECT * FROM users WHERE id = $1;";
  const sqlData = [id];

  const results = await pool.query(sql, sqlData);

  return results.rows[0];
};

db.read.userFromUsername = async (username) => {
  const sql = "SELECT * FROM users WHERE username = $1;";
  const sqlData = [username];

  const results = await pool.query(sql, sqlData);

  return results.rows[0];
};

db.read.usernameAvailability = async (username) => {
  const sql = "SELECT username FROM users WHERE username = $1;";
  const sqlData = [username];

  const results = await pool.query(sql, sqlData);

  return results.rows.length === 0;
};

module.exports = db;
