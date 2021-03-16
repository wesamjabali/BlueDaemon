const log = require("./helpers/log");
module.exports = {
  name: "invite",
  description: "Create a server invite",
  facultyOnly: false,
  privileged: false,
  usage: "invite",
  execute: async (msg, isModerator, isFaculty, client) => {
    const inv = await msg.channel.createInvite({
      maxAge: 0,
      unique: false,
    });

    msg.channel.send(`Here's your invite: ${inv}`);

    log(
      msg.channel,
      `${msg.author} created invite ${inv}\nContext: ${msg.url}`
    );
  },
};
