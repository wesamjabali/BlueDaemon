const Discord = require("discord.js");
const config = require("../config.json");
module.exports = {
  name: "help",
  description: "Display help message",
  facultyOnly: false,
  privileged: false,
  usage: "help <command?>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.channel.type == "dm") {
      msg.channel["config"] = { prefix: ".", primary_color: "#658fe8" };
    }
    /* Prepare arguments, attach to message. */
    msg.content = msg.content.replace(/ +(?= )/g, ""); // Remove duplicate spaces
    msg.content = msg.content.substring(msg.channel.config.prefix.length); // Remove prefix
    msg.args = msg.content.split(" "); // Split into an arg array
    msg.args[0] = msg.args[0].toLowerCase();

    allCommands = [];

    if (msg.args.length > 2) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }

    if (msg.args.length == 2) {
      const command = client.commands.get(msg.args[1]);
      if (command) {
        if (
          (((command.privileged && isModerator) || !command.privileged) &&
            ((command.facultyOnly && isFaculty) || !command.facultyOnly)) ||
          isModerator
        ) {
          msg.channel
            .send(`${msg.channel.config.prefix}${command.name}: \`\`\`${command.description}\`\`\`
Usage: \`\`\`${msg.channel.config.prefix}${command.usage}\`\`\``);
        }
      } else {
        msg.channel.send("That command doesn't exist. Use `.help`");
      }
      return;
    } else if (msg.args.length == 1) {
      client.commands.forEach((command) => {
        if (!command.privileged && !command.facultyOnly) {
          allCommands.push({
            name: `**${msg.channel.config.prefix}${command.name}:**`,
            value: `\`\`\`${command.description}\`\`\`\`\`\`${msg.channel.config.prefix}${command.usage}\`\`\`\0`,
          });
        }
      });
      if (isModerator) {
        allCommands.push({ name: "\u200B", value: "**__Mod commands:__**" });
        allCommands.push({
          name: `**${msg.channel.config.prefix}role:**`,
          value: `\`\`\`Create or delete a role\`\`\`\`\`\`${msg.channel.config.prefix}role <create/delete> <role>\`\`\`\0`,
        });
        client.commands.forEach((command) => {
          if (command.privileged) {
            allCommands.push({
              name: `**${msg.channel.config.prefix}${command.name}:**`,
              value: `\`\`\`${command.description}\`\`\`\`\`\`${msg.channel.config.prefix}${command.usage}\`\`\`\0`,
            });
          }
        });
      }
      if (isFaculty || isModerator) {
        allCommands.push({
          name: "\u200B",
          value: "**__Faculty commands:__**",
        });
        client.commands.forEach((command) => {
          if (command.facultyOnly) {
            allCommands.push({
              name: `**${msg.channel.config.prefix}${command.name}:**`,
              value: `\`\`\`${command.description}\`\`\`\`\`\`${command.usage}\`\`\`\0`,
            });
          }
        });
      }

      const helpEmbed = new Discord.MessageEmbed()
        .setTitle("Here to help!")
        .setDescription(`~~But only in the server~~`)
        .setAuthor("Course management")
        .addFields(allCommands)
        .setColor(msg.channel.config.primary_color)
        .setImage(config.banner)
        .setTimestamp()
        .setFooter("Need something else? Ask wesam");
      msg.channel.send(helpEmbed);
    }
  },
};
