const config = require("../config.json");
const deleteRole = require("./helpers/deleteRole");

module.exports = {
  name: "unlock",
  description: "Unlock a course",
  privileged: true,
  usage: config.prefix + "unlock <coursename>",
  execute(msg, isModerator, client) {
    if (!isModerator) {
      return;
    }

    if (msg.args.length != 2) {
      msg.channel.send(
        `${config.prefix}${this.name}:\`\`\`${this.description}\`\`\`\nUsage:\`\`\`${this.usage}\`\`\``
      );
      return;
    }

    deleteRole(`${config.currentQuarter}-${msg.args[1]}`).then(() => {
      msg.channel.send(`${msg.args[1]} unlocked, ${msg.author.toString()}`);
    });
  },
};
