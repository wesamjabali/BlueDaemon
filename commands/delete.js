const deleteRole = require("./helpers/deleteRole");
const log = require("./helpers/log");

module.exports = {
  name: "delete",
  description: "Delete a course",
  facultyOnly: false,
  privileged: true,
  usage: "delete <coursename>",
  execute: async (msg, isModerator, isFaculty, client) => {
    let roleName = `${msg.channel.config.current_quarter}-${msg.args[1]}`;

    if (msg.args.length != 2) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }

    /* Normalize course names to be lowercase */
    msg.args[1] = msg.args[1].toLowerCase();
    const category = client.channels.cache.find(
      (c) =>
        c.name == msg.channel.config.current_quarter && c.type == "category"
    );
    const foundRole = msg.guild.roles.cache.find(
      (r) => r.name.toUpperCase() === roleName.toUpperCase()
    );
    const foundChannel = msg.guild.channels.cache.find(
      (c) =>
        c.name.toUpperCase() === msg.args[1].toUpperCase() &&
        c.parent == category
    );
    if (foundRole && foundChannel) {
      await deleteRole(foundRole.id);
      foundRole.delete();
      foundChannel.delete();
      msg.channel.send(`${msg.args[1]} deleted successfully, ${msg.author}`);
      log(
        msg.channel,
        `${msg.author} deleted course #${msg.args[1]}\nContext: ${msg.url}`
      );
      return;
    } else if (foundChannel) {
      foundChannel.delete();
      msg.channel.send(
        `Channel for ${msg.args[1]} deleted successfully -- Role not found. Was the name changed? ${msg.author}`
      );
      log(
        msg.channel,
        `${msg.author} deleted channel trying to delete course #${msg.args[1]}\nContext: ${msg.url}`
      );
      return;
    } else if (foundRole) {
      foundRole.delete();
      msg.channel.send(
        `Role for ${msg.args[1]} deleted successfully -- Channel not found. Was the name changed? ${msg.author}`
      );
      log(
        msg.channel,
        `${msg.author} deleted role trying to delete course #${msg.args[1]}\nContext: ${msg.url}`
      );
      return;
    }

    msg.channel.send(`${msg.args[1]} not found, ${msg.author}`);
  },
};
