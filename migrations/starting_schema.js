const fs = require("fs");
const path = require("path");
const upSQLpath = path.join(__dirname, "sql/starting_schema_up.pgsql");

const downSQLpath = path.join(__dirname, "sql/starting_schema_down.pgsql");

exports.up = function (knex) {
  const raw = fs.readFileSync(upSQLpath).toString();
  return knex.schema.raw(raw);
};

exports.down = function (knex) {
  const raw = fs.readFileSync(downSQLpath).toString();
  return knex.schema.raw(raw);
};
