const config = require("../config.json");
const protectRole = require("./helpers/protectRole");
const Discord = require("discord.js");
const log = require("./helpers/log");
module.exports = {
  name: "create",
  description: "Create a course",
  facultyOnly: false,
  privileged: true,
  usage: config.prefix + "create <coursename> <password>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length == 3) {
      msg.delete();
    }
    if (msg.args.length < 2 || msg.args.length > 3) {
      msg.channel.send(
        `${config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }

    /* Normalize course names to be lowercase */
    msg.args[1] = msg.args[1].toLowerCase();

    // Check if category exists
    let category = client.channels.cache.find(
      (c) => c.name == config.currentQuarter && c.type == "category"
    );

    // Create category for the current quarter.
    if (!category) {
      category = await msg.guild.channels.create(config.currentQuarter, {
        type: "category",
      });

      msg.channel.send(`Created category for \`${config.currentQuarter}\`.`);
      return;
    }

    const roleName = `${config.currentQuarter}-${msg.args[1]}`;
    const modRole = await msg.guild.roles.cache.find(
      (r) => r.name === config.modRoleName
    );
    const facultyRole = await msg.guild.roles.cache.find(
      (r) => r.name === config.facultyRoleName
    );

    if (msg.guild.roles.cache.find((r) => r.name === roleName)) {
      msg.channel.send(`That course already exists, ${msg.author}`);
      return;
    }
    const newRole = await msg.guild.roles.create({
      data: {
        name: roleName,
      },
    });
    const newChannel = await msg.guild.channels.create(msg.args[1], {
      type: "text",
      parent: category,
      permissionOverwrites: [
        {
          id: msg.guild.id,
          deny: ["VIEW_CHANNEL"],
        },
        {
          id: newRole.id, // Course role
          allow: ["VIEW_CHANNEL"],
        },
        {
          id: modRole.id,
          allow: ["VIEW_CHANNEL"],
        },
        {
          id: facultyRole.id,
          allow: ["MANAGE_MESSAGES", "MENTION_EVERYONE"],
        },
      ],
    });
    if (msg.args.length == 3) {
      log(
        msg.guild,
        `${msg.author} created course ${newChannel} with password \`${msg.args[2]}\`\nContext: ${msg.url}`
      );
      protectRole(msg.args[1], msg.guild.id, msg.args[2]);
      msg.channel.send(`${newChannel} created with password, ${msg.author}`);
    } else {
      msg.channel.send(`${newChannel} created, ${msg.author}`);
      log(
        msg.guild,
        `${msg.author} created course ${newChannel}\nContext: ${msg.url}`
      );
    }
  },
};
