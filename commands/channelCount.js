const config = require("../config.json");
const Discord = require("discord.js");
module.exports = {
  name: "channelcount",
  description: "Returns number of channels in the server.",
  facultyOnly: false,
  privileged: true,
  usage: "channelcount",
  execute: async (msg, isModerator, isFaculty, client) => {
    msg.channel.send(msg.guild.channels.cache.size + "")
  },
};
