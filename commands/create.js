const protectRole = require("./helpers/protectRole");
const Discord = require("discord.js");
const log = require("./helpers/log");
const updateQuarter = require("./helpers/updateQuarter");
module.exports = {
  name: "create",
  description: "Create a course",
  facultyOnly: false,
  privileged: true,
  usage: "create <coursename> <password>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length == 3) {
      msg.delete();
    }
    if (msg.args.length < 2 || msg.args.length > 3) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }

    /* Normalize course names to be lowercase */
    msg.args[1] = msg.args[1].toLowerCase();

    // Check if category exists
    let category = client.channels.cache.find(
      (c) =>
        c.name == msg.channel.config.current_quarter && c.type == "category"
    );

    const roleName = `${msg.channel.config.current_quarter}-${msg.args[1]}`;
    const modRole = await msg.guild.roles.cache.find(
      (r) => r.id === msg.channel.config.mod_role
    );
    const facultyRole = await msg.guild.roles.cache.find(
      (r) => r.id === msg.channel.config.faculty_role
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

    // Role created!

    let tries = 1;
    let newChannel = null;
    while (!newChannel) {
      if (!category) {
        newRole.delete();
        let categoryName =
          tries === 1
            ? `${msg.channel.config.current_quarter}`
            : `${msg.channel.config.current_quarter}-${tries}`;
        createCategory(msg, categoryName);

        return;
      }
      tries++;

      newChannel = await msg.guild.channels
        .create(msg.args[1], {
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
        })
        .catch(async () => {
          console.log("Getting next category");
        });

      category = await client.channels.cache.find(
        (c) =>
          c.name == `${msg.channel.config.current_quarter}-${tries}` &&
          c.type == "category"
      );
    }

    if (!newChannel) {
      return;
    }

    if (msg.args.length == 3) {
      log(
        msg.channel,
        `${msg.author} created course ${newChannel} with password \`${msg.args[2]}\`\nContext: ${msg.url}`
      );
      protectRole(msg.guild.id, newRole.id, msg.args[2]);
      msg.channel.send(`${newChannel} created with password, ${msg.author}`);
    } else {
      msg.channel.send(`${newChannel} created, ${msg.author}`);
      log(
        msg.channel,
        `${msg.author} created course ${newChannel}\nContext: ${msg.url}`
      );
    }
  },
};

async function createCategory(msg, name) {
  // Create category for the current quarter.
  category = await msg.guild.channels.create(name, {
    type: "category",
  });

  msg.channel.send(`Category ${name} created!`);
  return category;
}
