const protectRole = require("./helpers/protectRole");

const config = require("../config.json");
module.exports = {
  name: "lock",
  description: "Lock a course",
  privileged: true,
  execute(msg, isModerator, client) {
    if(!isModerator) { return; }

    if (msg.args.length != 3) {
      msg.channel.send("Usage: ```.lock <coursename> <password>```");
      return;
    }

    protectRole(msg.args[1], msg.args[2]);
    msg.channel.send("Locked " + msg.args[1] + ", " + msg.author.toString());
    msg.delete();
  },
};
