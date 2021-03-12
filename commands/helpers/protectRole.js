const knex = require("../../knex");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const config = require("../../config.json");

module.exports =
  // Add a role and password to the DB.
  // Pass in role name without prefix!
  async function protectRole(roleName, password) {
    let bcryptPass = bcrypt.hashSync(password, salt);
    await knex("cdm_role_password").insert({
      role_name: config.currentQuarter + "-" + roleName,
      password: bcryptPass,
    });
  };
