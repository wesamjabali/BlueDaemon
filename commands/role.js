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
    
    const existingRole = await msg.member.roles.cache.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );
    


    /* role delete */
    if (msg.args[1] === "delete") {
      if (isModerator) {
        const roleInGuild = msg.guild.roles.cache.find(
          (r) => r.name.toLowerCase() === roleName.toLowerCase()
        );
        if (!roleInGuild) {
          msg.channel.send(`That role doesn't exist, ${msg.author}`);
          return;
        }
        roleInGuild.delete();
        msg.channel.send(`@${roleName} deleted, ${msg.author}`);
        log(
          msg.guild,
          `${msg.author} deleted role @${roleName}\nContext: ${msg.url}`
        );
      }
      return;
    }

    // Don't join or delete if role doesn't exist
    if (!existingRole) {
      msg.channel.send(`That role doesn't exist, ${msg.author}`);
      return;
    }

    /* role join */
    if (msg.args[1] === "join") {
      if (existingRole) {
        msg.channel.send(`You are already in that role, ${msg.author}`);
        return;
      }
      msg.member.roles.add(role);
      msg.channel.send(`Role added, ${msg.author}`);

      /* role leave */
    } else if (msg.args[1] === "leave") {
      if (existingRole) {
        msg.member.roles.remove(existingRole);
        msg.channel.send(`Removed from \`@${roleName}\`, ${msg.author}`);
      } else {
        msg.channel.send(`You're not part of \`@${roleName}\`, ${msg.author}`);
      }
      return;
    }
  },
};
