const log = require("./helpers/log");
const requiresPassword = require("./helpers/requiresPassword");
const verifyPassword = require("./helpers/verifyPassword");
module.exports = {
  name: "join",
  description: `Join a course`,
  facultyOnly: false,
  privileged: false,
  usage: "join <coursename>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length == 3) {
      await msg.author.send(
        `Please dont send passwords in the chat. Use ${msg.channel.config.prefix}join <classname> instead.`
      );
      msg.delete();
      return;
    }
    if (msg.args.length != 2) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }
    const filter = (message) => true;

    /* Normalize course names to be lowercase */
    msg.args[1] = msg.args[1].toLowerCase();

    let roleName = `${msg.channel.config.current_quarter}-${msg.args[1]}`;
    if (msg.member.roles.cache.find((r) => r.name === roleName)) {
      msg.channel.send(`You are already in that course, ${msg.author}`);
      return;
    }

    let role = msg.guild.roles.cache.find(
      (r) => r.name.toUpperCase() === roleName.toUpperCase()
    );
    if (!role) {
      await msg.channel.send(`That course doesn't exist, ${msg.author}`);

      return;
    }
    /* True if password is required */
    const protected = await requiresPassword(role.id);

    if (protected) {
      /* Protected role */
      await msg.channel.send(
        `That course is protected. I DM'd you for the password, ${msg.author}`
      );
      var tries = 3;
      while (tries) {
        await msg.author.send(`What is the password for ${msg.args[1]}?`);
        try {
          response = await msg.author.dmChannel.awaitMessages(filter, {
            max: 1,
            time: 45000,
            errors: ["time"],
          });
          /* To get rid of double messages: */
          if (response.first().author.bot) {
            throw Error("Detected double command. Exiting.");
          }
        } catch (err) {
          if (err.message) {
            msg.author.send(err.message);
          } else {
            msg.author.send(`Timed out. Try joining again.`);
          }
          return;
        }
        const verified = await verifyPassword(
          role.id,
          response.first().content
        );
        if (!verified) {
          msg.author.send(
            `Wrong password, ${msg.author}. You have __**${
              tries - 1
            }**__ tries left.`
          );
          --tries;
        } else {
          let role = msg.guild.roles.cache.find(
            (r) => r.name.toUpperCase() === roleName.toUpperCase()
          );
          msg.member.roles.add(role);
          msg.author.send(`${msg.args[1]} added, ${msg.author}`);
          log(
            msg.channel,
            `${msg.author} added to ${role} with password.\nContext: ${msg.url}`
          );
          tries = 0;
        }
      }
    } else {
      /* Unprotected role */
      msg.member.roles.add(role);
      msg.channel.send(`${msg.args[1]} added, ${msg.author}`);
      log(msg.channel, `${msg.author} added to ${role}\nContext: ${msg.url}`);
    }
  },
};
