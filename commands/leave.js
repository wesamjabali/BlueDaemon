const config = require("../config.json");
module.exports = {
  name: "leave",
  description: "Leave a course",
  privileged: false,
  usage: config.prefix + "leave <coursename>",
  execute(msg, isModerator, client) {
    if (msg.args.length != 2) {
      msg.channel.send(
        `${config.prefix}${this.name}:\`\`\`${this.description}\`\`\`\nUsage:\`\`\`${this.usage}\`\`\``
      );
      return;
    }
    let roleName = `${config.currentQuarter}-${msg.args[1]}`;
    let role = msg.member.roles.cache.find(
      (r) => r.name.toUpperCase() === roleName.toUpperCase()
    );
    if (role) {
      msg.member.roles.remove(role);
      msg.channel.send(
        `Removed from ${msg.args[1].toUpperCase()}, ${msg.author}!`
      );
    } else {
      msg.channel.send(`Role ${roleName} not found, ${msg.author}`);
    }
  },
};
