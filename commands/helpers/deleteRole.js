const knex = require("../../knex");

module.exports =
  // Remove a role and password from the DB.
  async function deleteRole(roleID) {
    await knex("cdm_role_password").where({ role_id: roleID }).delete();
  };
