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
    const roleName = `${msg.channel.config.current_quarter}-${msg.args[1]}`;

    const role = msg.guild.roles.cache.find(
      (r) => r.name.toUpperCase() === roleName.toUpperCase()
    );
    if (role) {
      await deleteRole(role.id);
      msg.channel.send(`${msg.args[1]} unlocked, ${msg.author}`);
    } else {
      msg.channel.send(`${msg.args[1]} not found, ${msg.author}`);
    }
  },
};
