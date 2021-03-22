const config = require("../config.json");
const knex = require("../knex");
const Discord = require("discord.js");
module.exports = {
  name: "guildMemberAdd",
  execute: async (member, client) => {
    [member.guild.config] = await knex("cdm_guild_config")
      .select("prefix", "primary_color", "server_description")
      .where({ guild_id: member.guild.id });
    if (!member.guild.config) {
      // If not set up, return.
      return;
    }
    let allCommands = [];
    client.commands.forEach((command) => {
      if (!command.privileged) {
        allCommands.push({
          name: member.guild.config.prefix + command.name,
          value: `\`\`\`${command.description}\n${member.guild.config.prefix}${command.usage}\`\`\``,
        });
      }
    });
    const welcomeEmbed = new Discord.MessageEmbed()
      .setTitle(`Welcome to ${member.guild.name}!`)
      .setDescription(
        `${member.guild.config.server_description}\n
This server hosts a bunch of courses that you can be a part of by using the \`${member.guild.config.prefix}join\` command! Join courses to get access to course-specific discussion.
`
      )
      .addFields(allCommands)
      .setImage(config.banner)
      .setColor(member.guild.config.primary_color)
      .setTimestamp()
      .setFooter("Use me in #bot-usage!");
    member.send(welcomeEmbed).catch(() => {});
  },
};
