const config = require("../config.json");
const Discord = require("discord.js");
const log = require("./helpers/log");

module.exports = {
  name: "invitebot",
  description: "Invite me to your server",
  facultyOnly: false,
  privileged: false,
  usage: ".inviteBot",
  execute: async (msg, isModerator, isFaculty, client) => {
    const inviteEmbed = new Discord.MessageEmbed()
      .setTitle("BlueDaemon")
      .setURL(
        "https://discord.com/api/oauth2/authorize?client_id=819103115693260860&permissions=8&scope=bot"
      )
      .addField(
        "Thanks for checking me out!",
        "Follow the link above to add me to your server"
      )
      .setColor(msg.guild.config.primary_color)
      .setTimestamp()
      .setImage(config.banner);

    msg.channel.send(`Response sent to your DM, ${msg.author}`);
    msg.author.send(inviteEmbed).catch(() => {
      msg.channel.send("Couldn't sent you a message. Are your DMs locked?");
    });
    log(
      msg.guild,
      `${msg.author} requested OAuth2 invite in ${msg.channel}\nContext: ${msg.url}`
    );
  },
};
