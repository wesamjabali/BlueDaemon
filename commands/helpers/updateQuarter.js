const knex = require("../../knex");
const { allGuildConfigs } = require("../../configs/guild");

module.exports = async function updateQuarter(guildID, newQuarter) {
  delete allGuildConfigs[guildID];
  await knex("cdm_guild_config")
    .where({ guild_id: guildID })
    .update({ current_quarter: newQuarter });
};
