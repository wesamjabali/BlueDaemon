const log = require("./helpers/log");

module.exports = {
  name: "getnames",
  description: "Returns the nicknames of people in a role",
  facultyOnly: true,
  privileged: false,
  usage: "getnames <@&courserole>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length != 2 || !msg.mentions.roles.first()) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }


    const role = msg.mentions.roles.first();
    let names = ``;
    role.members.each(member => names = `${names} \`${member.displayName}\``);
    msg.channel.send(names);
    log(
      msg.channel,
      `${msg.author} got names of \`@${role.name}\`\nContext: ${msg.url}`
    );
  },
};
