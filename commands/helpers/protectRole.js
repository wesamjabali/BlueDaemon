const knex = require("../../knex");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

module.exports =
  // Add a role and password to the DB.
  // Pass in role name without prefix!
  async function protectRole(guildID, roleID, password) {
    let bcryptPass = bcrypt.hashSync(password, salt);
    await knex("cdm_role_password").insert({
      role_id: roleID,
      password: bcryptPass,
      guild_id: guildID,
    });
  };
