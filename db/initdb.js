#! /usr/bin/env node

require("dotenv").config();
const fs = require("fs");
const db = require("./queries.js");

const users = require("./data/users.private.json");
const messages = require("./data/messages.private.json");

const { Client } = require("pg");

const SQL_drop_all = `
DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

DROP SEQUENCE IF EXISTS users_id_seq;
DROP SEQUENCE IF EXISTS messages_id_seq;
`;

const SQL_create_tables = `
CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(${Number(
      process.env.USERNAME_MAX_LENGTH
    )}) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(${Number(process.env.NAME_SURNAME_MAX_LENGTH)}) NOT NULL,
    surname VARCHAR(${Number(process.env.NAME_SURNAME_MAX_LENGTH)}) NOT NULL,
    signup_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    membership_start_date TIMESTAMPTZ DEFAULT NULL,
    admin_start_date TIMESTAMPTZ DEFAULT NULL,
    is_member BOOLEAN NOT NULL DEFAULT FALSE,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    membership_trait_noun VARCHAR(${
      1 + 2 * Number(process.env.MEMBERSHIP_RIDDLE_MAX_LENGTH)
    }) UNIQUE
);

CREATE TABLE messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(${Number(process.env.TITLE_MAX_LENGTH)}) NOT NULL,
    text VARCHAR(${Number(process.env.TEXT_MAX_LENGTH)}) NOT NULL,
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    users_only BOOLEAN NOT NULL DEFAULT FALSE,
    members_only BOOLEAN NOT NULL DEFAULT FALSE,
    author_id INTEGER NOT NULL,
    FOREIGN KEY(author_id) REFERENCES users(id) 
);
`;

const SQL_init_session_table = fs
  .readFileSync("node_modules/connect-pg-simple/table.sql")
  .toString();

const SQL_init = SQL_drop_all + SQL_create_tables + SQL_init_session_table;

const connectionString =
  process.argv.length > 2 ? process.argv[2] : process.env.DB_CONNECTION_STRING;

async function main() {
  const client = new Client({ connectionString });
  const usersUsernamesIdMap = new Map([]);

  await client.connect();
  await client.query(SQL_init);
  await client.end();

  // Populate the db
  for (const user of users) {
    const id = await db.create.user(user);

    usersUsernamesIdMap.set(user.username, id);

    if (user.is_member) {
      await db.update.upgradeUserToMember(
        id,
        user.membership_trait,
        user.membership_noun
      );
    }

    if (user.is_admin) {
      await db.update.upgradeUserToAdmin(id);
    }
  }

  for (const msg of messages) {
    const userId = usersUsernamesIdMap.get(msg.authorUsername);

    await db.create.message({ ...msg, userId });
  }
}

main();
