const config = require("../config.json");
const deleteRole = require("./helpers/deleteRole");

module.exports = {
  name: "unlock",
  description: "Unlock a course",
  privileged: true,
  execute(msg, isModerator, client) {
    if(!isModerator) { return; }

    if (msg.args.length != 2) {
      msg.channel.send("Usage: ```.unlock <coursename>```");
      return;
    }

    deleteRole(config.currentQuarter + "-" + msg.args[1]).then(() => {
      msg.channel.send(`${msg.args[1]} unlocked, ${msg.author.toString()}`);
    });
  },
};
