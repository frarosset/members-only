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

// Create a message
// Input: data (object with userId, title, text, access)
db.create.message = async (data) => {
  const usersOnly =
    data.access === "users_only" || data.access === "members_only";
  const membersOnly = data.access === "members_only";

  const sql =
    "INSERT INTO messages (title, text, users_only, members_only, author_id, creation_date) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id;";
  const sqlData = [data.title, data.text, usersOnly, membersOnly, data.userId];

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

db.read.membershipRiddleTraitAllowed = async (trait) => {
  const sql = "SELECT 1 FROM membership_riddle_traits WHERE trait = $1;";
  const sqlData = [trait];

  const results = await pool.query(sql, sqlData);

  return results.rows.length === 1;
};

db.read.membershipRiddleNounAllowed = async (noun) => {
  const sql = "SELECT 1 FROM membership_riddle_nouns WHERE noun = $1;";
  const sqlData = [noun];

  const results = await pool.query(sql, sqlData);

  return results.rows.length === 1;
};

module.exports = db;
