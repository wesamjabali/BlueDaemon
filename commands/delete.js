const config = require("../config.json");
const deleteRole = require("./helpers/deleteRole");

module.exports = {
  name: "delete",
  description: "Delete a course",
  facultyOnly: false,
  privileged: true,
  usage: config.prefix + "delete <coursename>",
  execute(msg, isModerator, isFaculty, client) {
    let roleName = `${config.currentQuarter}-${msg.args[1]}`;

    if (msg.args.length != 2) {
      msg.channel.send(
        `${config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }

    const foundRole = msg.guild.roles.cache.find(
      (r) => r.name.toUpperCase() === roleName.toUpperCase()
    );
    const foundChannel = msg.guild.channels.cache.find(
      (c) => c.name.toUpperCase() === msg.args[1].toUpperCase()
    );
    if (foundRole && foundChannel) {
      deleteRole(roleName, msg.guild.id)
        .then(() => {
          foundRole.delete();
          foundChannel.delete();
          msg.channel.send(
            `${msg.args[1]} deleted successfully, ${msg.author}`
          );
        })
        .catch(() => {
          msg.channel.send("Error deleting from database");
        });
      return;
    }

    msg.channel.send(`${msg.args[1]} not found, ${msg.author}`);
  },
};
