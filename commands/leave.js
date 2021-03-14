const config = require("../config.json");
const log = require("./helpers/log");
module.exports = {
  name: "leave",
  description: "Leave a course",
  facultyOnly: false,
  privileged: false,
  usage: config.prefix + "leave <coursename>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length != 2) {
      msg.channel.send(
        `${config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }
    let roleName = `${config.currentQuarter}-${msg.args[1]}`;
    let role = await msg.member.roles.cache.find(
      (r) => r.name.toUpperCase() === roleName.toUpperCase()
    );
    if (role) {
      msg.member.roles.remove(role);
      msg.channel.send(
        `Removed from ${msg.args[1].toUpperCase()}, ${msg.author}!`
      );
      log(msg.guild, `${msg.author} left ${role}\nContext: ${msg.url}`);
    } else {
      msg.channel.send(`Role ${roleName} not found, ${msg.author}`);
    }
  },
};
