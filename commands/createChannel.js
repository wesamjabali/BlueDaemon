const log = require("./helpers/log");
module.exports = {
  name: "createchannel",
  description: "Create a channel in your category.",
  facultyOnly: false,
  privileged: true,
  usage: ".createChannel <channel>",
  execute: async (msg, isModerator, isFaculty, client) => {
    // Disabled. This is too risky.
    msg.reply("This command is disabled.");
    return;

    if (msg.args.length != 2) {
      msg.channel.send(
        `${msg.guild.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }

    const category = msg.channel.parent;
    const modRole = msg.guild.roles.cache.find(
      (r) => r.id === msg.guild.config.mod_role
    );
    const facultyRole = msg.guild.roles.cache.find(
      (r) => r.id === msg.guild.config.faculty_role
    );
    const newChannel = await msg.guild.channels.create(msg.args[1], {
      type: "text",
      parent: category,
    });
    await newChannel.lockPermissions();
    msg.channel.send(
      `${newChannel} created in \`${category.name}\`, ${msg.author}`
    );
    log(
      msg.guild,
      `${msg.author} created ${newChannel} in category \`${category.name}\`\nContext: ${msg.url}`
    );
  },
};
