const config = require("../config.json");

module.exports = {
  name: "source",
  description: "Display source",
  privileged: false,
  usage: config.prefix + "source",
  execute(msg, isModerator, client) {
    msg.channel.send(`
Author: Wesam Jabali
Source: https://github.com/wesamjabali/BlueDaemon
`);
  },
};
