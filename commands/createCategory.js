const config = require("../config.json");
const log = require("./helpers/log");
const protectRole = require("./helpers/protectRole");
module.exports = {
  name: "createcategory",
  description: "Create a course category",
  facultyOnly: false,
  privileged: true,
  usage: config.prefix + "createCategory <coursename> <password>",
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

    const categoryName = `${config.currentQuarter}-${msg.args[1]}`;
    const roleName = categoryName; // For clarification

    // Check if category exists
    let existingCategory = await client.channels.cache.find(
      (c) => c.name == categoryName && c.type == "category"
    );
    if (existingCategory) {
      msg.channel.send(`That category already exists, ${msg.author}`);
      return;
    }
    /* Create new role for private category */
    const newRole = await msg.guild.roles.create({
      data: {
        name: roleName,
      },
    });

    const modRole = await msg.guild.roles.cache.find(
      (r) => r.name === config.modRoleName
    );
    const facultyRole = await msg.guild.roles.cache.find(
      (r) => r.name === config.facultyRoleName
    );

    /* Create category for the course */
    let category = await msg.guild.channels.create(categoryName, {
      type: "category",
      permissionOverwrites: [
        {
          id: msg.guild.id,
          deny: ["VIEW_CHANNEL"],
        },
        {
          id: newRole.id,
          allow: ["VIEW_CHANNEL"],
        },
        {
          id: modRole.id,
          allow: ["VIEW_CHANNEL"],
        },
        {
          id: facultyRole.id,
          allow: ["MANAGE_CHANNELS", "MANAGE_MESSAGES", "MENTION_EVERYONE"],
        },
      ],
    });

    /* Create first channel named "general" */
    let firstChannel = await msg.guild.channels.create("general", {
      type: "text",
      parent: category,
    });
    firstChannel.lockPermissions();

    /* Lock with passsword */
    if (msg.args.length == 3) {
      /* Store passwords in author's DM in case of forgotten password.
                TODO:
                Consider whether this is necessary -- the passwords are hashed in the DB and
                this may defeat the purpose and you can always delete/recreate if a password was forgotten. */
      msg.author.send(
        `Password created:\`\`\`${roleName}: ${msg.args[2]} \`\`\``
      );
      await protectRole(msg.args[1], msg.guild.id, msg.args[2]);
      msg.channel.send(
        `Created category \`${category.name}\` and channel ${firstChannel} with password.`
      );
      log(
        msg.guild,
        `${msg.author} created category \`${category.name}\` and channel ${firstChannel} with password \`${msg.args[2]}\`\nContext: ${msg.url}`
      );
    } else {
      msg.channel.send(
        `Created category \`${category.name}\` and channel ${firstChannel}`
      );
      log(
        msg.guild,
        `${msg.author} created category \`${category.name}\` and channel ${firstChannel}\nContext: ${msg.url}`
      );
    }
  },
};
