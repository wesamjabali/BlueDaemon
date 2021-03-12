const config = require("../config.json");

module.exports = {
  name: "role",
  description: "Manage roles",
  execute(msg, isModerator, client) {
    if (msg.args.length != 3) {
      msg.channel.send("Usage: ```.role <join/leave> <role>```");
      return;
    }
    const roleName = config.selfRolePrefix + "-" + msg.args[2];

    if (msg.args[1] === "create") {
      // Check if mod
      if (isModerator) {
        if (msg.guild.roles.cache.find((r) => r.name === roleName)) {
          msg.channel.send(
            "That role already exists, " + msg.author.toString()
          );
          return;
        }
        msg.guild.roles
          .create({
            data: {
              name: roleName,
            },
          })
          .then(() => {
            msg.channel.send(roleName + " created, " + msg.author.toString());
          })
          .catch(() => {
            msg.channel.send("Error creating role.");
            client.admin.send(
              "There was an error creating a role for " + msg.author.toString()
            );
          });
      } else {
        msg.channel.send(
          "Only people with " +
            config.modRoleName +
            " role can create roles, " +
            msg.author.toString()
        );
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
          msg.channel.send("That role doesn't exist, " + msg.author.toString());
          return;
        }
        role.delete();
        msg.channel.send(roleName + " deleted, " + msg.author.toString());
      } else {
        msg.channel.send(
          "Only people with " +
            config.modRoleName +
            " role can delete roles, " +
            msg.author.toString()
        );
        return;
      }
    }
    if (!role) {
      msg.channel.send("That role doesn't exist.");
      return;
    }
    if (msg.args[1] === "join") {
      if (
        msg.member.roles.cache.find(
          (r) => r.name.toLowerCase() === roleName.toLowerCase()
        )
      ) {
        msg.channel.send(
          "You are already in that role, " + msg.author.toString()
        );
        return;
      }
      msg.member.roles.add(role);
      msg.channel.send("Role added, " + msg.author.toString());
    } else if (msg.args[1] === "leave") {
      const role = msg.member.roles.cache.find(
        (r) => r.name.toLowerCase() === roleName.toLowerCase()
      );
      msg.member.roles.remove(role);
      msg.channel.send(
        "Removed from " + roleName + ", " + msg.author.toString()
      );
      return;
    }
  },
};
