#! /usr/bin/env node
const traits = require("./data/membership_riddle_traits.private.json");
const nouns = require("./data/membership_riddle_nouns.private.json");

require("dotenv").config();

const { Client } = require("pg");

const sql_init_command = "CREATE EXTENSION IF NOT EXISTS unaccent;";

const SQL_drop_all = `
DROP TABLE IF EXISTS membership_riddle_traits;
DROP TABLE IF EXISTS membership_riddle_nouns;
`;

const SQL_create_tables = `
CREATE TABLE membership_riddle_traits (
    trait VARCHAR(${Number(
      process.env.MEMBERSHIP_RIDDLE_MAX_LENGTH
    )}) PRIMARY KEY
);

CREATE TABLE membership_riddle_nouns (
    noun VARCHAR(${Number(
      process.env.MEMBERSHIP_RIDDLE_MAX_LENGTH
    )}) PRIMARY KEY
);
`;

const SQL_populate_tables = `
    INSERT INTO membership_riddle_traits (trait) VALUES ${arrayToInsertValuesString(
      traits
    )};

    INSERT INTO membership_riddle_nouns (noun) VALUES ${arrayToInsertValuesString(
      nouns
    )};
`;

const SQL_init =
  sql_init_command + SQL_drop_all + SQL_create_tables + SQL_populate_tables;

const connectionString =
  process.argv.length > 2 ? process.argv[2] : process.env.DB_CONNECTION_STRING;

async function main() {
  const client = new Client({ connectionString });

  await client.connect();
  await client.query(SQL_init);
  await client.end();
}

main();

function arrayToInsertValuesString(arr) {
  return [...new Set(arr)].map((itm) => `('${itm}')`).join(",");
}
