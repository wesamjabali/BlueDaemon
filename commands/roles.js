const config = require("../config.json");
const Discord = require("discord.js");
module.exports = {
  name: "roles",
  description: "Display available roles",
  privileged: false,
  usage: config.prefix + "roles",
  execute(msg, isModerator, client) {
    let selfRoles = [];
    const rolesList = msg.guild.roles.cache.filter((r) =>
      r.name.startsWith(config.selfRolePrefix + "-")
    );
    rolesList.forEach((s) => {
      selfRoles.push({
        name: s.name.split("-").splice(config.prefix.length).join("-"),
        value: "\u200B",
        inline: true,
      });
    });
    selfRoles.sort();
    const rolesEmbed = new Discord.MessageEmbed()
      .setTitle("Roles")
      .setFooter(`Use ${config.prefix}role join <rolename>`)
      .addFields(selfRoles);

    msg.channel.send(rolesEmbed);
  },
};
