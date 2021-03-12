const config = require("../config.json");
const requiresPassword = require("./helpers/requiresPassword");
const verifyPassword = require("./helpers/verifyPassword");
module.exports = {
  name: "join",
  description: "Join a course",
  privileged: false,
  execute(msg, isModerator, client) {
    if (msg.args.length < 2 || msg.args.length > 3) {
      msg.channel.send("Usage: ```.join <coursename> <password?>```");
      return;
    }

    let roleName = config.currentQuarter + "-" + msg.args[1];
    if (msg.member.roles.cache.find((r) => r.name === roleName)) {
      msg.channel.send(
        "You are already in that course, " + msg.author.toString()
      );
      return;
    }

    requiresPassword(roleName)
      .then((protected) => {
        if (protected && msg.args.length == 2) {
          msg.channel.send(
            "Ask your professor to join " +
              msg.args[1] +
              ", " +
              msg.author.toString()
          );
          return;
        }
        let role = msg.guild.roles.cache.find(
          (r) => r.name.toUpperCase() === roleName.toUpperCase()
        );
        if (!role) {
          msg.channel.send("That role doesn't exist.");
        } else if (role && !protected) {
          msg.member.roles.add(role);
          msg.channel.send("Course added, " + msg.author.toString());
        } else if (role && protected) {
          verifyPassword(roleName, msg.args[2])
            .then((verified) => {
              if (!verified) {
                msg.delete();
                msg.channel.send("Wrong password, " + msg.author.toString());
              } else {
                let role = msg.guild.roles.cache.find(
                  (r) => r.name.toUpperCase() === roleName.toUpperCase()
                );
                msg.member.roles.add(role);
                msg.delete();
                msg.channel.send("Course added, " + msg.author.toString());
              }
            })
            .catch(() => {
              msg.channel.send("Error verifying password.");
              client.admin.send(
                "There was an error verifying the password for " +
                  msg.author.toString()
              );
            });
        }
      })
      .catch(() => {
        msg.channel.send("Error checking password lock.");
        client.admin.send(
          "There was an error checking password lock for " +
            msg.author.toString()
        );
      });
  },
};
