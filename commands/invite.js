const log = require("./helpers/log");
module.exports = {
  name: "invite",
  description: "Create a server invite",
  facultyOnly: false,
  privileged: false,
  usage: ".invite",
  execute: async (msg, isModerator, isFaculty, client) => {
    const inv = await msg.channel.createInvite({
      maxAge: 0,
      unique: true,
    });

    msg.channel.send(`Request sent to your DM, ${msg.author}`);
    msg.author.send(`Here's your invite: ${inv}`).catch(() => {
      msg.channel.send("Couldn't sent you a message. Are your DMs locked?");
      return;
    });
    log(msg.guild, `${msg.author} created invite ${inv}\nContext: ${msg.url}`);
  },
};
