const config = require("../config.json");
const Discord = require("discord.js");
module.exports = {
  name: "source",
  description: "Display source",
  facultyOnly: false,
  privileged: false,
  usage: ".source",
  execute: async (msg, isModerator, isFaculty, client) => {
    const sourceEmbed = new Discord.MessageEmbed()
      .setTitle("View my source on Github")
      .setDescription("Author: Wesam Jabali")
      .setURL("https://github.com/wesamjabali/BlueDaemon")
      .addField(
        "\u200B",
        "Like this bot? Consider [buying me a coffee!](https://www.buymeacoffee.com/wesamjabali)"
      )
      .setColor(msg.guild.config.primary_color)
      .setImage(config.banner);

    msg.channel.send(sourceEmbed);
  },
};
