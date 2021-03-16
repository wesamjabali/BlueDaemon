const knex = require("../../knex");

module.exports =
  // Check if a role requires a password
  async function requiresPassword(roleID) {
    const [protectedRole] = await knex("cdm_role_password")
      .where({ role_id: roleID })
      .select("*");
    return !!protectedRole;
  };
