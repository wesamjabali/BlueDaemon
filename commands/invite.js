const config = require("../config.json");
const log = require("./helpers/log");
module.exports = {
  name: "invite",
  description: "Create a server invite",
  facultyOnly: false,
  privileged: false,
  usage: config.prefix + "invite",
  execute: async (msg, isModerator, isFaculty, client) => {
    const inv = await msg.channel.createInvite({
      maxAge: 0,
      unique: true,
    });

    msg.channel.send(`Request sent to your DM, ${msg.author}`);
    msg.author.send(`Here's your invite: ${inv}`);
    log(`${msg.author} created invite ${inv}\nContext: ${msg.url}`);
  },
};
