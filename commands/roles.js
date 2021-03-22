const Discord = require("discord.js");
module.exports = {
  name: "roles",
  description: "Display available roles",
  facultyOnly: false,
  privileged: false,
  usage: "roles",
  execute: async (msg, isModerator, isFaculty, client) => {
    let selfRoles = [];
    const rolesList = msg.guild.roles.cache.filter((r) =>
      r.name.startsWith(msg.channel.config.self_role_prefix + "-")
    );
    rolesList.forEach((s) => {
      selfRoles.push({
        name: `\`\`\`${s.name
          .split("-")
          .splice(1)
          .join("-")}\`\`\``,
        value: "\u200B",
        inline: true,
      });
    });
    selfRoles.sort();
    const rolesEmbed = new Discord.MessageEmbed()
      .setTitle("Roles:")
      .setFooter(`${msg.channel.config.prefix}role join <rolename>`)
      .setColor(msg.channel.config.primary_color)
      .addFields(selfRoles);

    msg.channel.send(rolesEmbed);
  },
};
