const Discord = require("discord.js");
const config = require("../config.json");
module.exports = {
  name: "help",
  description: "Display this message",
  privileged: false,
  execute(msg, isModerator, client) {
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
    msg.channel
      .send(`Response sent to your DM, ${msg.author.toString()}`)
      .then((sentMessage) => setTimeout(() => sentMessage.delete(), 4000))
      // Delete message after 4 seconds
      .catch(console.error);
    msg.author.send(helpEmbed);
  },
};
