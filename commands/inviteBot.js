const config = require("../config.json");
const Discord = require("discord.js");

module.exports = {
  name: "invitebot",
  description: "Invite me to your server",
  facultyOnly: false,
  privileged: false,
  usage: config.prefix + "inviteBot",
  execute(msg, isModerator, client) {
    const inviteEmbed = new Discord.MessageEmbed()
      .setTitle("BlueDaemon")
      .setURL(
        "https://discord.com/api/oauth2/authorize?client_id=819103115693260860&permissions=0&scope=bot"
      )
      .addField(
        "Thanks for checking me out!",
        "Follow the link above to add me to your server"
      )
      .setColor(config.primaryColor)
      .setTimestamp()
      .setImage(config.banner);

    msg.channel.send(`Response sent to your DM, ${msg.author}`);
    msg.author.send(inviteEmbed);
  },
};
