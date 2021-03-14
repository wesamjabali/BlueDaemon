const config = require("../config.json");
const log = require("./helpers/log");

module.exports = {
  name: "role",
  description: `Manage your roles`,
  facultyOnly: false,
  privileged: false,
  usage: config.prefix + "role <join/leave> <role>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length != 3) {
      msg.channel.send(
        `${config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }
    const roleName = `${config.selfRolePrefix}-${msg.args[2]}`;

    /* role create */
    if (msg.args[1] === "create") {
      if (isModerator) {
        if (msg.guild.roles.cache.find((r) => r.name === roleName)) {
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
          msg.guild,
          `${msg.author} created role \`@${roleName}\`\nContext: ${msg.url}`
        );
      }
      return;
    }

    const roleInGuild = await msg.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );
    const roleInUser = await msg.member.roles.cache.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );

    // Don't join or leave if role doesn't exist for user
    if (!roleInGuild) {
      msg.channel.send(`That role doesn't exist, ${msg.author}`);
      return;
    }

    /* role delete */
    if (msg.args[1] === "delete") {
      if (isModerator) {
        roleInGuild.delete();
        msg.channel.send(`@${roleName} deleted, ${msg.author}`);
        log(
          msg.guild,
          `${msg.author} deleted role @${roleName}\nContext: ${msg.url}`
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
      msg.channel.send(`Role added, ${msg.author}`);

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
