const deleteRole = require("./helpers/deleteRole");

module.exports = {
  name: "unlock",
  description: "Unlock a course",
  facultyOnly: false,
  privileged: true,
  usage: "unlock <coursename>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length != 2) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }
    await deleteRole(
      `${msg.channel.config.current_quarter}-${msg.args[1]}`,
      msg.guild.id
    );
    msg.channel.send(`${msg.args[1]} unlocked, ${msg.author}`);
  },
};
