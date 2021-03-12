const knex = require("../../knex");
const bcrypt = require("bcryptjs");

module.exports =
  // Verify a password is correct
  async function verifyPassword(roleName, password) {
    const [protectedRole] = await knex("cdm_role_password")
      .where({ role_name: roleName })
      .select("password");
    return bcrypt.compareSync(password, protectedRole.password);
  };
