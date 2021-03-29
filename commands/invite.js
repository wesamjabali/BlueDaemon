const log = require("./helpers/log");
module.exports = {
  name: "invite",
  description: "Create a server invite",
  facultyOnly: false,
  privileged: false,
  usage: "invite",
  execute: async (msg, isModerator, isFaculty, client) => {
    const introductions = msg.guild.channels.cache.find(
      (ch) => ch.name === "introductions"
    );
    if (introductions) {
      const inv = await msg.channel.createInvite({
        maxAge: 0,
        channel: introductions,
        unique: true,
      });
    } else {
      const inv = await msg.channel.createInvite({
        maxAge: 0,
        unique: true,
      });
    }

    msg.channel.send(`Here's your invite: ${inv}`);

    log(
      msg.channel,
      `${msg.author} created invite ${inv}\nContext: ${msg.url}`
    );
  },
};
