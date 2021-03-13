const config = require("../config.json");

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

    if (msg.args[1] === "create") {
      // Check if mod
      if (isModerator) {
        if (msg.guild.roles.cache.find((r) => r.name === roleName)) {
          msg.channel.send(`That role already exists, ${msg.author}`);
          return;
        }
        msg.guild.roles
          .create({
            data: {
              name: roleName,
            },
          })
          .then(() => {
            msg.channel.send(`${roleName} created, ${msg.author}`);
          })
          .catch(() => {
            msg.channel.send("Error creating role.");
            client.admin.send(
              `There was an error creating a role for ${msg.author}`
            );
          });
      }
      return;
    }
    const role = msg.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );

    if (msg.args[1] === "delete") {
      // Check if mod
      if (isModerator) {
        const role = msg.guild.roles.cache.find(
          (r) => r.name.toLowerCase() === roleName.toLowerCase()
        );
        if (!role) {
          msg.channel.send(`That role doesn't exist, ${msg.author}`);
          return;
        }
        role.delete();
        msg.channel.send(`${roleName} deleted, ${msg.author}`);
      }
    }

    // Don't join or leave if role doesn't exist
    if (!role) {
      msg.channel.send(`That role doesn't exist, ${msg.author}`);
      return;
    }

    if (msg.args[1] === "join") {
      if (
        msg.member.roles.cache.find(
          (r) => r.name.toLowerCase() === roleName.toLowerCase()
        )
      ) {
        msg.channel.send(`You are already in that role, ${msg.author}`);
        return;
      }
      msg.member.roles.add(role);
      msg.channel.send(`Role added, ${msg.author}`);
    } else if (msg.args[1] === "leave") {
      const role = msg.member.roles.cache.find(
        (r) => r.name.toLowerCase() === roleName.toLowerCase()
      );
      msg.member.roles.remove(role);
      msg.channel.send(`Removed from ${roleName} , ${msg.author}`);
      return;
    }
  },
};
