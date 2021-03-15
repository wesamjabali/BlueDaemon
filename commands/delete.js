const deleteRole = require("./helpers/deleteRole");
const log = require("./helpers/log");

module.exports = {
  name: "delete",
  description: "Delete a course",
  facultyOnly: false,
  privileged: true,
  usage: ".delete <coursename>",
  execute: async (msg, isModerator, isFaculty, client) => {
    let roleName = `${msg.guild.config.current_quarter}-${msg.args[1]}`;

    if (msg.args.length != 2) {
      msg.channel.send(
        `${msg.guild.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }

    /* Normalize course names to be lowercase */
    msg.args[1] = msg.args[1].toLowerCase();

    const foundRole = msg.guild.roles.cache.find(
      (r) => r.name.toUpperCase() === roleName.toUpperCase()
    );
    const foundChannel = msg.guild.channels.cache.find(
      (c) => c.name.toUpperCase() === msg.args[1].toUpperCase()
    );
    if (foundRole && foundChannel) {
      await deleteRole(roleName, msg.guild.id);
      foundRole.delete();
      foundChannel.delete();
      msg.channel.send(`${msg.args[1]} deleted successfully, ${msg.author}`);
      log(
        msg.guild,
        `${msg.author} deleted course #${msg.args[1]}\nContext: ${msg.url}`
      );
      return;
    }

    msg.channel.send(`${msg.args[1]} not found, ${msg.author}`);
  },
};
