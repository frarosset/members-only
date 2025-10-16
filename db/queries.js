const pool = require("./pool.js");
const { securePasswordForStorage } = require("../utils/passwordUtils.js");

const db = { create: {}, read: {}, update: {}, delete: {} };

// Create a user
// Input: data (object with username, password (plain-text), name, surname)
// The password is secured before being stored on the db
db.create.user = async (data) => {
  const passwordHash = await securePasswordForStorage(data.password);

  const sql =
    "INSERT INTO users (username, password_hash, name, surname, signup_date) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id;";
  const sqlData = [data.username, passwordHash, data.name, data.surname];

  const results = await pool.query(sql, sqlData);

  return results.rows[0].id;
};

db.update.upgradeUserToMember = async (id, trait, noun) => {
  const sql = `
    UPDATE users 
    SET is_member = TRUE,
    membership_start_date = CURRENT_TIMESTAMP,
    membership_trait_noun = $2
    WHERE id = $1 
    RETURNING id;
  `;
  const sqlData = [id, `${trait} ${noun}`];

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

db.read.membershipRiddleCheckValidity = async (id, trait, noun) => {
  // the membership riddle validator is implemented as a sql query stored as env variable to keep it secret!
  const sql = process.env.MEMBERSHIP_RIDDLE_CHECK_VALIDITY_SQL;
  const sqlData = [id, trait, noun];

  const results = await pool.query(sql, sqlData);

  return results.rows.length > 0;
};

db.read.membershipTraitNounAvailability = async (trait, noun) => {
  const sql = "SELECT 1 FROM users WHERE membership_trait_noun = $1;";
  const sqlData = [`${trait} ${noun}`];

  const results = await pool.query(sql, sqlData);

  return results.rows.length === 0;
};

module.exports = db;
