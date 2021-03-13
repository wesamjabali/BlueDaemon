const config = require("../config.json");
const protectRole = require("./helpers/protectRole");
module.exports = {
  name: "deletecategory",
  description: "Delete a course category",
  facultyOnly: false,
  privileged: true,
  usage: config.prefix + "createCategory <coursename>",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length != 2) {
      msg.channel.send(
        `${config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }
    const categoryName = `${config.currentQuarter}-${msg.args[1]}`;
    const roleName = categoryName; // For clarification

    // Check if category exists
    let existingCategory = await client.channels.cache.find(
      (c) => c.name == categoryName && c.type == "category"
    );
    if (!existingCategory) {
      msg.channel.send(`That category doesn't exist, ${msg.author}`);
      return;
    }

    existingCategory.children.forEach((channel) => channel.delete());
    existingCategory.delete();
    msg.channel.send(`Deleted ${msg.args[1]}, ${msg.author}`);
  },
};
