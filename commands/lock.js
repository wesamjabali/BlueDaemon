const protectRole = require("./helpers/protectRole");

module.exports = {
  name: "lock",
  description: "Lock a course",
  facultyOnly: false,
  privileged: true,
  usage: "lock <coursename> <password>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length != 3) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }
    const roleName = `${msg.channel.config.current_quarter}-${msg.args[1]}`
    const role = msg.guild.roles.cache.find(
      (r) => r.name.toUpperCase() === roleName.toUpperCase()
    );
    if (role) {
      protectRole(msg.guild.id, role.id, msg.args[2]);
      log(
        msg.channel,
        `${msg.author} locked \`@${role.name}\`\nContext: ${msg.url}`
      );
      msg.channel.send(`${msg.args[1]} locked, ${msg.author}`);
    } else {
      msg.channel.send(`${msg.args[1]} not found, ${msg.author}`);
    }
    msg.delete();
  },
};
