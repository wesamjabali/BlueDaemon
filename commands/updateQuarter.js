const config = require("../config.json");
const updateQuarter = require("./helpers/updateQuarter");
module.exports = {
  name: "updatequarter",
  description: "Update quarter and disable all current quarters.",
  facultyOnly: false,
  privileged: true,
  usage: "updatequarter <NewQuarter>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length != 2) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }

    updateQuarter(msg.guild.id, msg.args[1]);
    msg.channel.send(`Updated to ${msg.args[1]}`);
  },
};
