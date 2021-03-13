const knex = require("../../knex");

module.exports =
  // Check if a role requires a password
  async function requiresPassword(roleName, guildID) {
    const [protectedRole] = await knex("cdm_role_password")
      .where({ role_name: roleName, guild_id: guildID })
      .select("*");
    return !!protectedRole;
  };
