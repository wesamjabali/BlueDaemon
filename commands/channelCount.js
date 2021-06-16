const config = require("../config.json");
const Discord = require("discord.js");
module.exports = {
  name: "channelcount",
  description: "channelcount",
  facultyOnly: false,
  privileged: true,
  usage: "channelcount",
  execute: async (msg, isModerator, isFaculty, client) => {
    msg.channel.send(msg.guild.channels.cache.size + "")
  },
};
