const knex = require("../../knex");
module.exports = {
  name: "setup",
  description: "Set your server up.",
  facultyOnly: false,
  privileged: false,
  usage: "setup",
  execute: async (msg, isModerator, isFaculty, client) => {
    const filterBotMessages = () => true;
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      msg.channel.send(`Ask an administrator to set me up, ${msg.author}`);
      return;
    }
    const timeoutMS = 45000; // Milliseconds admin has to respond
    var config = { guild_id: msg.guild.id, primary_color: "#658fe8" };
    try {
      var response = "";
      var valid = false;
      msg.channel.send(`Setup process started in your DM, ${msg.author}`);

      /* Get user's name, send it back. */
      await msg.author
        .send(
          `Welcome to **BlueDaemon**, your new course manager. To get started, what's your name?`
        )
        .catch(() => {
          msg.channel.send("Couldn't sent you a message. Are your DMs locked?");
          return;
        });
      response = await msg.author.dmChannel.awaitMessages(filterBotMessages, {
        max: 1,
        time: timeoutMS,
        errors: ["time"],
      });
      /* To get rid of double setups: */
      if (response.first().author.bot) {
        throw Error("Bot responded.");
      }
      response
        .first()
        .reply(`Great! Let's get started, ${response.first().content}!`);

      valid = false;
      /* Get server description */
      while (!valid) {
        await msg.author.send(
          `Give me a short (up to 120 character) description of your server.`
        );
        response = await msg.author.dmChannel.awaitMessages(filterBotMessages, {
          max: 1,
          time: timeoutMS * 3,
          errors: ["time"],
        });
        /* To get rid of double setups: */
        if (response.first().author.bot) {
          throw Error("Bot responded.");
        }
        if (response.first().content.length <= 120) {
          valid = true;
          config["server_description"] = response.first().content;
          response
            .first()
            .reply(
              `Great! Your server description is: \`${
                response.first().content
              }\`\n**You'll have __${
                timeoutMS / 1000
              } seconds__ to respond to the next questions.**`
            );
        } else {
          response
            .first()
            .reply(
              `Cut it down by ${
                response.first().content.length - 120
              } characters, and try again.`
            );
        }
      }

      valid = false;
      /* Get prefix */
      while (!valid) {
        await msg.author.send(
          `What's your desired command prefix? I prefer a period: \`.\``
        );
        response = await msg.author.dmChannel.awaitMessages(filterBotMessages, {
          max: 1,
          time: timeoutMS,
          errors: ["time"],
        });
        /* To get rid of double setups: */
        if (response.first().author.bot) {
          throw Error("Bot responded.");
        }
        if (response.first().content.length == 1) {
          valid = true;
          config["prefix"] = response.first().content;
          response
            .first()
            .reply(`Great! Your prefix is: \`${response.first().content}\``);
        } else {
          response.first().reply(`Your prefix must be one character long.`);
        }
      }

      /* Get mod role name */
      valid = false;
      while (!valid) {
        await msg.author.send(
          `What's your preferred __**moderator role**__ name? A role will be created if it doesn't exist. I prefer \`Moderator\``
        );
        var modRole;
        response = await msg.author.dmChannel.awaitMessages(filterBotMessages, {
          max: 1,
          time: timeoutMS,
          errors: ["time"],
        });
        /* To get rid of double setups: */
        if (response.first().author.bot) {
          throw Error("Bot responded.");
        }
        if (!response.first().content.includes(" ")) {
          valid = true;
          modRole = msg.guild.roles.cache.find(
            (r) =>
              r.name.toLowerCase() == response.first().content.toLowerCase()
          );
          if (!modRole) {
            await msg.author.send(
              `@${response.first().content} doesn't exist! Creating it now...`
            );
            modRole = await msg.guild.roles.create({
              data: {
                name: response.first().content,
              },
            });
          }
          config["mod_role"] = modRole.id;
          response
            .first()
            .reply(`Great! Your mod role is: \`@${response.first().content}\``);
        } else {
          msg.author.send("No spaces allowed, try again.");
        }
      }

      /* Get faculty role name */
      valid = false;
      while (!valid) {
        await msg.author.send(
          `What's your preferred __**faculty role**__ name? A role will be created if it doesn't exist. I prefer \`Faculty\``
        );
        var facultyRole;
        response = await msg.author.dmChannel.awaitMessages(filterBotMessages, {
          max: 1,
          time: timeoutMS,
          errors: ["time"],
        });
        /* To get rid of double setups: */
        if (response.first().author.bot) {
          throw Error("Bot responded.");
        }
        if (!response.first().content.includes(" ")) {
          valid = true;
          facultyRole = msg.guild.roles.cache.find(
            (r) =>
              r.name.toLowerCase() == response.first().content.toLowerCase()
          );
          if (!facultyRole) {
            await msg.author.send(
              `@${response.first().content} doesn't exist! Creating it now...`
            );
            facultyRole = await msg.guild.roles.create({
              data: {
                name: response.first().content,
              },
            });
          }
          config["faculty_role"] = facultyRole.id;
          response
            .first()
            .reply(
              `Great! Your faculty role is: \`@${response.first().content}\``
            );
        } else {
          msg.author.send("No spaces allowed, try again.");
        }
      }

      /* Get log channel name */
      valid = false;
      while (!valid) {
        await msg.author.send(
          `What's your preferred __**logging channel**__ name? A channel will be created if it doesn't exist. I prefer \`daemon-log\``
        );

        var logChannel;

        response = await msg.author.dmChannel.awaitMessages(filterBotMessages, {
          max: 1,
          time: timeoutMS,
          errors: ["time"],
        });
        /* To get rid of double setups: */
        if (response.first().author.bot) {
          throw Error("Bot responded.");
        }
        if (!response.first().content.includes(" ")) {
          valid = true;
          logChannel = msg.guild.channels.cache.find(
            (c) =>
              c.name.toLowerCase() == response.first().content.toLowerCase()
          );
          if (!logChannel) {
            await msg.author.send(
              `#${response.first().content} doesn't exist! Creating it now...`
            );
            logChannel = await msg.guild.channels.create(
              response.first().content
            );
          }

          config["log_channel"] = logChannel.id;
          response
            .first()
            .reply(
              `Great! Your course logs will be in: \`#${
                response.first().content
              }\``
            );
        } else {
          msg.author.send("No spaces allowed, try again.");
        }
      }

      /* Get current quarter/semester */
      valid = false;
      while (!valid) {
        await msg.author.send(
          `What's the current quarter/semester? Follow this format: \`spring21\` No spaces, please.`
        );
        response = await msg.author.dmChannel.awaitMessages(filterBotMessages, {
          max: 1,
          time: timeoutMS,
          errors: ["time"],
        });
        /* To get rid of double setups: */
        if (response.first().author.bot) {
          throw Error("Bot responded.");
        }
        if (!response.first().content.includes(" ")) {
          valid = true;
          config["current_quarter"] = response.first().content;
          response
            .first()
            .reply(
              `Great! Your current quarter/semester is: \`${
                response.first().content
              }\``
            );
        } else {
          msg.author.send("No spaces allowed, try again.");
        }
      }

      valid = false;
      /* Get desired role prefix */
      while (!valid) {
        await msg.author.send(
          `What's your preferred self-role prefix? I prefer: \`dpu\``
        );
        response = await msg.author.dmChannel.awaitMessages(filterBotMessages, {
          max: 1,
          time: timeoutMS,
          errors: ["time"],
        });
        /* To get rid of double setups: */
        if (response.first().author.bot) {
          throw Error("Bot responded.");
        }
        if (!response.first().content.includes(" ")) {
          valid = true;
          config["self_role_prefix"] = response.first().content;
          response
            .first()
            .reply(
              `Great! Your self-role prefix is: \`${response.first().content}\``
            );
        } else {
          msg.author.send("No spaces allowed, try again.");
        }
      }

      /* Insert configuration into DB */

      await knex("cdm_guild_config")
        .insert(config)
        .catch(() => {
          msg.author.send(`Looks like this configuration's already created! `);
        });
      msg.author.send(
        `Done! You may now create courses. Use \`${config.prefix}help\` **inside ${msg.guild.name}** for details. Make sure you have \`@${modRole.name}\` role!`
      );
    } catch (err) {
      msg.author.send("Timed out! Say .setup in your server to try again.");
    }
  },
};
