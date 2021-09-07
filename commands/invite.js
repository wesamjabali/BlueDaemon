const log = require("./helpers/log");
module.exports = {
  name: "invite",
  description: "Create a server invite",
  facultyOnly: false,
  privileged: false,
  usage: "invite",
  execute: async (msg, isModerator, isFaculty, client) => {
    const introductions = msg.guild.channels.cache.find(
      (ch) => ch.id === "826130360462475274"
    );
    let inv;
    if (introductions) {
      inv = await introductions.createInvite({
        maxAge: 604800,
        unique: false,
      });
    } else {
      inv = await msg.channel.createInvite({
        maxAge: 604800,
        unique: false,
      });
    }

    msg.channel.send(`Here's your invite: ${inv}`);

    log(
      msg.channel,
      `${msg.author} created invite ${inv}\nContext: ${msg.url}`
    );
  },
};
