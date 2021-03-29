const knex = require("../../knex");

module.exports = async function protectRole(guildID, newQuarter) {
  await knex("cdm_guild_config")
    .where({ guild_id: guildID })
    .update({ current_quarter: newQuarter });
};
