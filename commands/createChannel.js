const config = require("../config.json");
module.exports = {
  name: "createchannel",
  description: "Create a channel in your category",
  facultyOnly: true,
  privileged: false,
  usage: config.prefix + "createChannel <channel>",
  execute: async (msg, isModerator, client) => {
    if (msg.args.length != 2) {
      msg.channel.send(
        `${config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }
    const category = msg.channel.parent;
    const modRole = msg.guild.roles.cache.find(
      (r) => r.name === config.modRoleName
    );
    const facultyRole = msg.guild.roles.cache.find(
      (r) => r.name === config.facultyRoleName
    );
    const newChannel = await msg.guild.channels.create(msg.args[1], {
      type: "text",
      parent: category,
      permissionOverwrites: [
        { id: modRole.id, allow: ["VIEW_CHANNEL"] },
        {
          id: facultyRole.id,
          allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "MANAGE_MESSAGES"],
        },
      ],
    });
    msg.channel.send(
      `${newChannel} created in \`${category.name}\`, ${msg.author}`
    );
  },
};
