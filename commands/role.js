const log = require("./helpers/log");

module.exports = {
  name: "role",
  description: `Manage your roles`,
  facultyOnly: false,
  privileged: false,
  usage: "role <join/leave> <role>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length != 3) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }

    /* Normalize everything lowercase */
    msg.args[1] = msg.args[1].toLowerCase();
    msg.args[2] = msg.args[2].toLowerCase();
    const roleName = `${msg.channel.config.self_role_prefix}-${msg.args[2]}`;

    const roleInGuild = await msg.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );
    const roleInUser = await msg.member.roles.cache.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );

    /* role create */
    if (msg.args[1] === "create") {
      if (isModerator) {
        if (roleInGuild) {
          msg.channel.send(`That role already exists, ${msg.author}`);
          return;
        }
        const newRole = await msg.guild.roles.create({
          data: {
            name: roleName,
          },
        });

        msg.channel.send(`${newRole} created, ${msg.author}`);
        log(
          msg.channel,
          `${msg.author} created role \`@${roleName}\`\nContext: ${msg.url}`
        );
      }
      return;
    }

    // Don't join or leave if role doesn't exist for user
    if (!roleInGuild) {
      msg.channel.send(`That role doesn't exist, ${msg.author}`);
      return;
    }

    /* role delete */
    if (msg.args[1] === "delete") {
      if (isModerator) {
        roleInGuild.delete();
        msg.channel.send(`\`@${roleName}\` deleted, ${msg.author}`);
        log(
          msg.channel,
          `${msg.author} deleted role \`@${roleName}\`\nContext: ${msg.url}`
        );
      }
      return;
    }

    /* role join */
    if (msg.args[1] === "join") {
      if (roleInUser) {
        msg.channel.send(`You are already in that role, ${msg.author}`);
        return;
      }
      msg.member.roles.add(roleInGuild);
      msg.channel.send(`\`@${roleName}\` added, ${msg.author}`);

      /* role leave */
    } else if (msg.args[1] === "leave") {
      if (roleInUser) {
        msg.member.roles.remove(roleInUser);
        msg.channel.send(`Removed from \`@${roleName}\`, ${msg.author}`);
      } else {
        msg.channel.send(`You're not part of \`@${roleName}\`, ${msg.author}`);
      }
      return;
    }
  },
};
