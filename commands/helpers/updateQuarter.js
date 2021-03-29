const knex = require("../../knex");

module.exports = async function protectRole(guildID, newQuarter) {
  let bcryptPass = bcrypt.hashSync(password, salt);
  await knex("cdm_guild_config")
    .where({ guild_id: guildID })
    .update({ current_quarter: newQuarter });
};
