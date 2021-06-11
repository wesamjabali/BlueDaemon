const deleteRole = require("./helpers/deleteRole");
const config = require("../config.json");

module.exports = {
  name: "request",
  description: "Request a course",
  facultyOnly: false,
  privileged: false,
  usage: "request <coursename> <description>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length < 2) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }
    msg.args.shift();
    const request = msg.args.join(" ");

    const requestsChannel = msg.guild.channels.cache.find(
      (channel) => channel.id == config.courseRequestsChannel
    );

    const newMessage = await requestsChannel.send(
      `<@&796214872479498241> New request from ${msg.author}:\n${request}`
    );
    newMessage.react("✅");
    await msg.channel.send("Request sent!");
    msg.delete();
  },
};
