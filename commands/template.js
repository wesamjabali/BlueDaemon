const config = require("../config.json");
const deleteRole = require("./helpers/deleteRole");

module.exports = {
  name: "unlock",
  description: "Unlock a course",
  execute(msg) {
    if (msg.args.length != 2) {
      msg.channel.send("Usage: ```.unlock <classname>```");
      return;
    }

    deleteRole(config.currentQuarter + "-" + msg.args[1]).then(() => {
      msg.channel.send(msg.args[1] + " unlocked, " + msg.author.toString());
    });
  },
};
