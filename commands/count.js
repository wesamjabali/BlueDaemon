const deleteRole = require("./helpers/deleteRole");
const log = require("./helpers/log");

module.exports = {
  name: "count",
  description: "Returns the number of people in a role",
  facultyOnly: true,
  privileged: false,
  usage: "count <@&courserole>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length != 2 || !msg.mentions.roles.first()) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }

    const role = msg.mentions.roles.first();
    msg.channel.send(
      `There are **${role.members.size}** members in that role, ${msg.author}.`
    );

    log(
      msg.channel,
      `${msg.author} counted \`@${role.name}\`\nContext: ${msg.url}`
    );
  },
};
