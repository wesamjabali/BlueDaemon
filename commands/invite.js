const config = require("../config.json");
module.exports = {
  name: "invite",
  description: "Create a server invite",
  facultyOnly: false,
  privileged: false,
  usage: config.prefix + "invite",
  execute(msg, isModerator, client) {
    msg.channel
      .createInvite({
        maxAge: 0,
        unique: true,
      })
      .then((inv) => {
        msg.channel.send(`Request sent to your DM, ${msg.author}`);
        msg.author.send(`Here's your invite: ${inv}`);
      });
  },
};
