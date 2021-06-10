const deleteRole = require("./helpers/deleteRole");
const config = require("../config.json");

module.exports = {
  name: "request",
  description: "Request a course",
  facultyOnly: false,
  privileged: false,
  usage: "request <coursename> <description>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length < 1) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }
    const request = msg.args.join(" ");

    const requestsChannel = msg.guild.channels.cache.find(
      (channel) => channel.id == config.courseRequestsChannel
    );

    requestsChannel.send(`@everyone New request from ${msg.author}: ${request}`);
    msg.channel.send("Request sent!")
  },
};
