const deleteRole = require("./helpers/deleteRole");
module.exports = {
  name: "deletecategory",
  description: "Delete a course category",
  facultyOnly: false,
  privileged: true,
  usage: `.deleteCategory <coursename>`,
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length != 2) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
      );
      return;
    }

    /* Normalize course names to be lowercase */
    msg.args[1] = msg.args[1].toLowerCase();

    const categoryName = `${msg.channel.config.current_quarter}-${msg.args[1]}`;
    const roleName = categoryName; // For clarification
    const role = await msg.guild.roles.cache.find(
      (role) => role.name == roleName
    );

    // Check if category exists
    let existingCategory = await client.channels.cache.find(
      (c) => c.name == categoryName && c.type == "category"
    );

    if (!existingCategory || !role) {
      msg.channel.send(`That course doesn't exist, ${msg.author}`);
      return;
    }

    /* Send message first to avoid crashes */
    msg.channel.send(`Deleted ${msg.args[1]}, ${msg.author}`);

    /* Delete all associated information with category */
    await role.delete();
    await existingCategory.children.forEach((channel) => channel.delete());
    await existingCategory.delete();
    await deleteRole(role.id);
  },
};
