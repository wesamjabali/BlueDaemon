const knex = require("../../knex");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

module.exports =
  // Add a role and password to the DB.
  // Pass in role name without prefix!
  async function protectRole(roleName, guildID, password) {
    let bcryptPass = bcrypt.hashSync(password, salt);
    await knex("cdm_role_password").insert({
      role_name: roleName,
      guild_id: guildID,
      password: bcryptPass,
    });
  };
