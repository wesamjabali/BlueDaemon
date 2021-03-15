const knex = require("../../knex");
module.exports = {
  name: "setup",
  description: "Set your server up.",
  facultyOnly: false,
  privileged: false,
  usage: "setup",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      msg.channel.send(`Ask an administrator to set me up, ${msg.author}`);
      return;
    }
    const timeoutMS = 30000; // Milliseconds admin has to respond
    var config = { guild_id: msg.guild.id, primary_color: "#658fe8" };
    try {
      var response = "";
      var valid = false;
      msg.channel.send(`Setup process started in your DM, ${msg.author}`);

      /* Get user's name, send it back. */
      await msg.author
        .send(
          `Welcome to BlueDaemon, your new course manager. To get started, what's your name?`
        )
        .catch(() => {
          msg.channel.send("Couldn't sent you a message. Are your DMs locked?");
          return;
        });
      response = await msg.author.dmChannel.awaitMessages(
        function () {
          return true;
        },
        { max: 1, time: timeoutMS, errors: ["time"] }
      );
      response
        .first()
        .reply(`Great! Let's get started, ${response.first().content}!`);

      valid = false;
      /* Get server description */
      while (!valid) {
        await msg.author.send(
          `Give me a short (up to 120 character) description of your server. You have a bit more time to fill this out.`
        );
        response = await msg.author.dmChannel.awaitMessages(
          function () {
            return true;
          },
          { max: 1, time: timeoutMS * 3, errors: ["time"] }
        );

        if (response.first().content.length <= 120) {
          valid = true;
          config["server_description"] = response.first().content;
          response
            .first()
            .reply(
              `Great! Your server description is: \`${
                response.first().content
              }\``
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
        response = await msg.author.dmChannel.awaitMessages(
          function () {
            return true;
          },
          { max: 1, time: timeoutMS, errors: ["time"] }
        );

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

      valid = false;
      /* Get mod role name */
      while (!valid) {
        await msg.author.send(
          `What's your moderator role name? I prefer \`Moderator\``
        );

        var modRole;

        response = await msg.author.dmChannel.awaitMessages(
          function () {
            return true;
          },
          { max: 1, time: timeoutMS, errors: ["time"] }
        );

        modRole = msg.guild.roles.cache.find(
          (r) => r.name.toLowerCase() == response.first().content.toLowerCase()
        );

        if (modRole) {
          valid = true;
          config["mod_role"] = modRole.id;
          response
            .first()
            .reply(`Great! Your mod role is: \`@${response.first().content}\``);
        } else {
          response.first().reply(`That role doesn't exist in your server.`);
        }
      }

      valid = false;
      /* Get faculty role name */
      while (!valid) {
        await msg.author.send(
          `What's your faculty role name? I prefer \`Faculty\``
        );

        var facultyRole;

        response = await msg.author.dmChannel.awaitMessages(
          function () {
            return true;
          },
          { max: 1, time: timeoutMS, errors: ["time"] }
        );

        facultyRole = msg.guild.roles.cache.find(
          (r) => r.name.toLowerCase() == response.first().content.toLowerCase()
        );

        if (facultyRole) {
          valid = true;
          config["faculty_role"] = facultyRole.id;
          response
            .first()
            .reply(
              `Great! Your faculty role is: \`@${response.first().content}\``
            );
        } else {
          response.first().reply(`That role doesn't exist in your server.`);
        }
      }
      valid = false;

      /* Get log channel name */
      while (!valid) {
        await msg.author.send(
          `What's your logging channel name? I prefer \`daemon-log\``
        );

        var logChannel;

        response = await msg.author.dmChannel.awaitMessages(
          function () {
            return true;
          },
          { max: 1, time: timeoutMS, errors: ["time"] }
        );

        logChannel = msg.guild.channels.cache.find(
          (c) => c.name.toLowerCase() == response.first().content.toLowerCase()
        );

        if (logChannel) {
          valid = true;
          config["log_channel"] = logChannel.id;
          response
            .first()
            .reply(
              `Great! Your logging channel is: \`#${response.first().content}\``
            );
        } else {
          response.first().reply(`That channel doesn't exist in your server.`);
        }
      }

      valid = false;
      /* Get current quarter/semester */
      while (!valid) {
        await msg.author.send(
          `What's the current quarter/semester? Follow this format: \`spring21\` No spaces, please.`
        );
        response = await msg.author.dmChannel.awaitMessages(
          function () {
            return true;
          },
          { max: 1, time: timeoutMS, errors: ["time"] }
        );

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
          response.first().reply(`No spaces, please!`);
        }
      }

      valid = false;
      /* Get desired role prefix */
      while (!valid) {
        await msg.author.send(
          `What's your preferred self-role prefix? I prefer: \`dpu\``
        );
        response = await msg.author.dmChannel.awaitMessages(
          function () {
            return true;
          },
          { max: 1, time: timeoutMS, errors: ["time"] }
        );

        if (!response.first().content.includes(" ")) {
          valid = true;
          config["self_role_prefix"] = response.first().content;
          response
            .first()
            .reply(
              `Great! Your self-role prefix is: \`${response.first().content}\``
            );
        } else {
          response.first().reply(`No spaces, please!`);
        }
      }

      /* Insert configuration into DB */
      await knex("cdm_guild_config").insert(config);
      msg.author.send(
        "Done! You may now create courses. Use `.help` for details. Make sure you have moderator role!"
      );
    } catch {
      msg.author.send("Timed out! Say .setup in your server to try again.");
    }
  },
};
