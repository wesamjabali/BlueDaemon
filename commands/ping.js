const config = require("../config.json");
module.exports = {
  name: "ping",
  description: "Ping the server",
  facultyOnly: false,
  privileged: true,
  usage: "ping",
  execute: async (msg, isModerator, isFaculty, client) => {
    var pong = await msg.channel.send(`Pong! `)
    pong.edit(`Pong! ${pong.createdTimestamp - msg.createdTimestamp}ms`)
  },
};
