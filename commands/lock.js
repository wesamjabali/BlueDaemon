const protectRole = require("./helpers/protectRole");

module.exports = {
  name: "lock",
  description: "Lock a course",
  facultyOnly: false,
  privileged: true,
  usage: ".lock <coursename> <password>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length != 3) {
      msg.channel.send(
        `${msg.guild.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }

    protectRole(
      `${msg.guild.config.current_quarter}-${msg.args[1]}`,
      msg.guild.id,
      msg.args[2]
    );
    msg.channel.send(`Locked ${msg.args[1]}, ${msg.author}`);
    msg.delete();
  },
};
