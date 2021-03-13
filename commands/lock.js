const protectRole = require("./helpers/protectRole");

const config = require("../config.json");
module.exports = {
  name: "lock",
  description: "Lock a course",
  facultyOnly: false,
  privileged: true,
  usage: config.prefix + "lock <coursename> <password>",
  execute(msg, isModerator, isFaculty, client) {
    if (msg.args.length != 3) {
      msg.channel.send(
        `${config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }

    protectRole(msg.args[1], msg.guild.id, msg.args[2]);
    msg.channel.send(`Locked ${msg.args[1]}, ${msg.author}`);
    msg.delete();
  },
};
