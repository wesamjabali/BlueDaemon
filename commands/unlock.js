const config = require("../config.json");
const deleteRole = require("./helpers/deleteRole");

module.exports = {
  name: "unlock",
  description: "Unlock a course",
  facultyOnly: false,
  privileged: true,
  usage: config.prefix + "unlock <coursename>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length != 2) {
      msg.channel.send(
        `${config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }

    deleteRole(`${config.currentQuarter}-${msg.args[1]}`, msg.guild.id).then(
      () => {
        msg.channel.send(`${msg.args[1]} unlocked, ${msg.author}`);
      }
    );
  },
};
