const config = require("../config.json");
const Discord = require("discord.js");
module.exports = {
  name: "source",
  description: "View my source code on GitHub",
  facultyOnly: false,
  privileged: false,
  usage: "source",
  execute: async (msg, isModerator, isFaculty, client) => {
    const sourceEmbed = new Discord.MessageEmbed()
      .setTitle("View my source code on GitHub")
      .setDescription("Author: Wesam Jabali")
      .setURL("https://github.com/wesamjabali/BlueDaemon")
      .addField(
        "\u200B",
        "Like this bot? Consider [buying me a coffee!](https://www.buymeacoffee.com/wesamjabali)"
      )
      .setColor(msg.channel.config.primary_color)
      .setImage(config.banner);

    msg.channel.send(sourceEmbed);
  },
};
