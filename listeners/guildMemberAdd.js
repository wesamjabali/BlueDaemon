const config = require("../config.json");
const Discord = require("discord.js");
module.exports = {
  name: "guildMemberAdd",
  execute(member, client) {
    let allCommands = [];
    client.commands.forEach((command) => {
      if (!command.privileged) {
        allCommands.push({
          name: config.prefix + command.name,
          value: `\`\`\`${command.description}\n${command.usage}\`\`\``,
        });
      }
    });
    const logo = new Discord.MessageAttachment("./assets/logo.png", "logo.png");
    const welcomeEmbed = new Discord.MessageEmbed()
      .setTitle("Welcome to CDM Discussions!")
      .setDescription(`The central hub for all CDM classes and discussions`)
      .setAuthor("BlueDaemon")
      .addFields(allCommands)
      .setThumbnail("attachment://logo.png")
      .setImage(config.banner)
      .attachFiles(logo)
      .setTimestamp()
      .setFooter("Use me in #bot-usage!");
    member.send(welcomeEmbed);
  },
};
