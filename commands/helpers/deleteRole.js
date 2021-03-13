const knex = require("../../knex");

module.exports =
  // Remove a role and password from the DB.
  async function deleteRole(roleName, guildID) {
    await knex("cdm_role_password").where({ role_name: roleName, guild_id: guildID }).delete();
  };
