const protectRole = require("./helpers/protectRole");

const config = require("../config.json");
module.exports = {
  name: "lock",
  description: "Lock a course",
  privileged: true,
  usage: config.prefix + "lock <coursename> <password>",
  execute(msg, isModerator, client) {


    if (msg.args.length != 3) {
      msg.channel.send(
        `${config.prefix}${this.name}:\`\`\`${this.description}\`\`\`\nUsage:\`\`\`${this.usage}\`\`\``
      );
      return;
    }

    protectRole(msg.args[1], msg.args[2]);
    msg.channel.send(`Locked ${msg.args[1]}, ${msg.author}`);
    msg.delete();
  },
};
