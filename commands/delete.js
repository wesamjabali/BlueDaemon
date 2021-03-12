const config = require("../config.json");
const deleteRole = require("./helpers/deleteRole");

module.exports = {
  name: "delete",
  description: "Delete a course",
  execute(msg, isModerator, client) {
    if(!isModerator) { return; }

    let roleName = config.currentQuarter + "-" + msg.args[1];

    if (msg.args.length != 2) {
      msg.channel.send("Usage: ```.delete <coursename>```");
      return;
    }

    const foundRole = msg.guild.roles.cache.find(
      (r) => r.name.toUpperCase() === roleName.toUpperCase()
    );
    const foundChannel = msg.guild.channels.cache.find(
      (c) => c.name.toUpperCase() === msg.args[1].toUpperCase()
    );
    if (foundRole && foundChannel) {
      deleteRole(roleName)
        .then(() => {
          foundRole.delete();
          foundChannel.delete();
          msg.channel.send(
            msg.args[1] + " deleted successfully, " + msg.author.toString()
          );
        })
        .catch(() => {
          msg.channel.send("Error deleting from database");
        });
      return;
    }

    msg.channel.send(msg.args[1] + " not found, " + msg.author.toString());
  },
};
