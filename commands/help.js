const Discord = require("discord.js");
const config = require("../config.json");
module.exports = {
  name: "help",
  description: "Display this message",
  privileged: false,
  execute(msg, isModerator, client) {
    let courses = [];
    let selfRoles = [];
    let roles = msg.guild.roles.cache.filter((role) =>
      role.name.startsWith(config.currentQuarter + "-")
    );
    roles.forEach((s) => {
      courses.push(s.name.split("-").splice(1).join("-").toUpperCase());
    });
    courses.sort();

    const rolesList = msg.guild.roles.cache.filter((r) =>
      r.name.startsWith(config.selfRolePrefix + "-")
    );
    rolesList.forEach((s) => {
      selfRoles.push(s.name.split("-").splice(1).join("-"));
    });
    selfRoles.sort();
    allCommands = [];

    client.commands.forEach((command) => {
      if (!command.privileged) {
        allCommands.push({
          name: command.name,
          value: `\`\`\`${command.description}\`\`\``,
        });
      }
    });

    if (isModerator) {
      client.commands.forEach((command) => {
        if (command.privileged) {
          allCommands.push({
            name: command.name,
            value: `\`\`\`${command.description}\`\`\``,
          });
        }
      });
    }
    const logo = new Discord.MessageAttachment("./logo.png", "logo.png");
    const helpEmbed = new Discord.MessageEmbed()
      .setTitle(".help")
      .setDescription(
        `All commands start with \`\`\`${config.prefix}\`\`\`
Do a command to see usage.`
      )
      .setAuthor("Course management")
      .addFields(allCommands)
      .setThumbnail("attachment://logo.png")
      .attachFiles(logo)
      .setTimestamp()
      .setFooter("Need something else? Ask wesam");

    msg.channel.send(helpEmbed);
  },
};
