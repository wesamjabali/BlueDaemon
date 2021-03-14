const config = require("../config.json");
const log = require("./helpers/log");
const requiresPassword = require("./helpers/requiresPassword");
const verifyPassword = require("./helpers/verifyPassword");
module.exports = {
  name: "join",
  description: `Join a course`,
  facultyOnly: false,
  privileged: false,
  usage: config.prefix + "join <coursename> <password?>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length < 2 || msg.args.length > 3) {
      msg.channel.send(
        `${config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }

    /* Normalize course names to be lowercase */
    msg.args[1] = msg.args[1].toLowerCase();

    let roleName = `${config.currentQuarter}-${msg.args[1]}`;
    if (msg.member.roles.cache.find((r) => r.name === roleName)) {
      msg.channel.send(`You are already in that course, ${msg.author}`);
      return;
    }

    requiresPassword(roleName, msg.guild.id)
      .then((protected) => {
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
          msg.channel.send(`That role doesn't exist, ${msg.author}`);
        } else if (role && !protected) {
          msg.member.roles.add(role);
          msg.channel.send(`Course added, ${msg.author}`);
          log(`${msg.author} added to ${roleName} with password.`);
        } else if (role && protected) {
          verifyPassword(roleName, msg.args[2], msg.guild.id)
            .then((verified) => {
              msg.delete();
              if (!verified) {
                msg.channel.send(`Wrong password, ${msg.author}`);
              } else {
                let role = msg.guild.roles.cache.find(
                  (r) => r.name.toUpperCase() === roleName.toUpperCase()
                );
                msg.member.roles.add(role);
                msg.channel.send(`Course added, ${msg.author}`);
                log(`${msg.author} added to ${roleName} with password.`);
              }
            })
            .catch(() => {
              msg.channel.send("Error verifying password.");
              client.admin.send(
                `There was an error verifying the password for ${msg.author}`
              );
            });
        }
      })
      .catch(() => {
        msg.channel.send("Error checking password lock.");
        client.admin.send(
          `There was an error checking password lock for ${msg.author}`
        );
      });
  },
};
