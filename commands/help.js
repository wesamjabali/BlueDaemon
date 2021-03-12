const Discord = require("discord.js");
const config = require("../config.json");
module.exports = {
  name: "help",
  description: "Display help message",
  privileged: false,
  usage: config.prefix + "help <command?>",
  execute(msg, isModerator, client) {
    allCommands = [];
    if (msg.args.length > 2) {
      msg.channel.send(`Usage: \`\`\`${module.exports.usage}\`\`\``);
      return;
    }
    if (msg.args.length == 2) {
      const command = client.commands.get(msg.args[1]);
      if (command) {
        if ((command.privileged && isModerator) || !command.privileged) {
          msg.channel
            .send(`${config.prefix}${command.name}: \`\`\`${command.description}\`\`\`
Usage: \`\`\`${command.usage}\`\`\``);
        }
      } else {
        msg.channel.send("That command doesn't exist. Use `.help`");
      }
      return;
    } else if (msg.args.length == 1) {
      client.commands.forEach((command) => {
        if (!command.privileged) {
          allCommands.push({
            name: command.name,
            value: `\`\`\`${command.description}\n${command.usage}\`\`\``,
          });
        }
      });

      if (isModerator) {
        client.commands.forEach((command) => {
          if (command.privileged) {
            allCommands.push({
              name: command.name,
              value: `\`\`\`${command.description}\n${command.usage}\`\`\``,
            });
          }
        });
      }
      const logo = new Discord.MessageAttachment("./logo.png", "logo.png");
      const helpEmbed = new Discord.MessageEmbed()
        .setTitle(".help")
        .setDescription(
          `Do a command to see usage.\nAll commands start with \`\`\`${config.prefix}\`\`\``
        )
        .setAuthor("Course management")
        .addFields(allCommands)
        .setThumbnail("attachment://logo.png")
        .attachFiles(logo)
        .setTimestamp()
        .setFooter("Need something else? Ask wesam");
      if (msg.channel.type !== "dm") {
        msg.channel.send(`Response sent to your DM, ${msg.author.toString()}`);
        // .then((sentMessage) => setTimeout(() => sentMessage.delete(), 3000))
        // Delete message after 4 seconds
        // .catch(console.error);
      }
      msg.author.send(helpEmbed);
    }
  },
};
