const log = require("./helpers/log");
const requiresPassword = require("./helpers/requiresPassword");
const verifyPassword = require("./helpers/verifyPassword");
module.exports = {
  name: "join",
  description: `Join a course`,
  facultyOnly: false,
  privileged: false,
  usage: "join <coursename> <password?>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length < 2 || msg.args.length > 3) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }

    /* Normalize course names to be lowercase */
    msg.args[1] = msg.args[1].toLowerCase();

    let roleName = `${msg.channel.config.current_quarter}-${msg.args[1]}`;
    if (msg.member.roles.cache.find((r) => r.name === roleName)) {
      msg.channel.send(`You are already in that course, ${msg.author}`);
      return;
    }

    /* True if password is required */
    const protected = await requiresPassword(roleName, msg.guild.id);

    if (protected && msg.args.length == 2) {
      msg.channel.send(
        `Ask your professor to join ${msg.args[1]}, ${msg.author}`
      );
      return;
    }
    let role = msg.guild.roles.cache.find(
      (r) => r.name.toUpperCase() === roleName.toUpperCase()
    );

    if (!role) {
      msg.channel.send(`That course doesn't exist, ${msg.author}`);

      /* Unprotected role */
    } else if (role && !protected) {
      msg.member.roles.add(role);
      msg.channel.send(`Course added, ${msg.author}`);
      log(msg.channel, `${msg.author} added to ${role}\nContext: ${msg.url}`);

      /* Protected role */
    } else if (role && protected) {
      const verified = await verifyPassword(
        roleName,
        msg.args[2],
        msg.guild.id
      );
      msg.delete();
      if (!verified) {
        msg.channel.send(`Wrong password, ${msg.author}`);
      } else {
        let role = msg.guild.roles.cache.find(
          (r) => r.name.toUpperCase() === roleName.toUpperCase()
        );
        msg.member.roles.add(role);
        msg.channel.send(`Course added, ${msg.author}`);
        log(
          msg.channel,
          `${msg.author} added to ${role} with password.\nContext: ${msg.url}`
        );
      }
    }
  },
};
