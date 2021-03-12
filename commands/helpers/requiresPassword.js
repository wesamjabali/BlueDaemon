const knex = require("../../knex");

module.exports =
  // Check if a role requires a password
  async function requiresPassword(roleName) {
    const [protectedRole] = await knex("cdm_role_password")
      .where({ role_name: roleName })
      .select("*");
    return !!protectedRole;
  };
