module.exports = {
  name: "source",
  description: "Display source message",
  execute(msg, isModerator, client) {
    msg.channel.send(`
Author: Wesam Jabali
Source: https://github.com/wesamjabali/BlueDaemon
`);
  },
};
