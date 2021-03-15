const Discord = require("discord.js");
const config = require("../config.json");
module.exports = {
  name: "help",
  description: "Display help message",
  facultyOnly: false,
  privileged: false,
  usage: ".help <command?>",
  execute: async (msg, isModerator, isFaculty, client) => {
    /* Prepare arguments, attach to message. */
    msg.content = msg.content.replace(/ +(?= )/g, ""); // Remove duplicate spaces
    msg.content = msg.content.substring(msg.guild.config.prefix.length); // Remove prefix
    msg.args = msg.content.split(" "); // Split into an arg array
    msg.args[0] = msg.args[0].toLowerCase();

    allCommands = [];

    if (msg.args.length > 2) {
      msg.channel.send(
        `${msg.guild.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
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
            .send(`${msg.guild.config.prefix}${command.name}: \`\`\`${command.description}\`\`\`
Usage: \`\`\`${command.usage}\`\`\``);
        }
      } else {
        msg.channel.send("That command doesn't exist. Use `.help`");
      }
      return;
    } else if (msg.args.length == 1) {
      client.commands.forEach((command) => {
        if (!command.privileged && !command.facultyOnly) {
          allCommands.push({
            name: `**${msg.guild.config.prefix}${command.name}:**`,
            value: `\`\`\`${command.description}\`\`\`\`\`\`${command.usage}\`\`\`\0`,
          });
        }
      });
      if (isModerator) {
        allCommands.push({ name: "\u200B", value: "**__Mod commands:__**" });
        allCommands.push({
          name: `**${msg.guild.config.prefix}role:**`,
          value: `\`\`\`Create or delete a role\`\`\`\`\`\`${msg.guild.config.prefix}role <create/delete> <role>\`\`\`\0`,
        });
        client.commands.forEach((command) => {
          if (command.privileged) {
            allCommands.push({
              name: `**${msg.guild.config.prefix}${command.name}:**`,
              value: `\`\`\`${command.description}\`\`\`\`\`\`${command.usage}\`\`\`\0`,
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
              name: `**${msg.guild.config.prefix}${command.name}:**`,
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
        .setColor(msg.guild.config.primary_color)
        .setImage(config.banner)
        .setTimestamp()
        .setFooter("Need something else? Ask wesam");
      if (msg.channel.type !== "dm") {
        msg.channel.send(`Response sent to your DM, ${msg.author}`);
      }
      msg.author.send(helpEmbed).catch(() => {
        msg.channel.send("Couldn't sent you a message. Are your DMs locked?");
        return;
      });
    }
  },
};
