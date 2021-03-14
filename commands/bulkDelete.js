const config = require("../config.json");
const log = require("./helpers/log");
module.exports = {
  name: "bulkdelete",
  description: "Bulk delete courses, separated by a space.",
  facultyOnly: false,
  privileged: true,
  usage: config.prefix + "bulkdelete <courses>+",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length < 2) {
      msg.channel.send(
        `${config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }

    // Find quarter category
    let category = client.channels.cache.find(
      (c) => c.name == config.currentQuarter && c.type == "category"
    );

    // Disable bulk create without quarter category.
    if (!category) {
      msg.channel.send(`No category found for ${config.currentQuarter}.`);
      return;
    }

    let courseNames = [];
    msg.args.shift();
    msg.args.sort();
    msg.args.forEach((arg) => {
      courseNames.push(arg.toLowerCase());
    });

    var deletedCourses = [];
    courseNames.forEach((courseName) => {
      const existingRole = msg.guild.roles.cache.find(
        (r) => r.name === `${config.currentQuarter}-${courseName}`
      );
      const existingChannel = msg.guild.channels.cache.find(
        (c) => c.name === courseName && c.parent == category
      );
      if (!existingRole || !existingChannel) {
        msg.channel.send(
          `Non-existant course: \`${config.currentQuarter}-${courseName}\``
        );
        return;
      } else {
        deletedCourses.push(courseName);
        existingChannel.delete();
        existingRole.delete();
      }
    });

    msg.channel.send(`Courses deleted: \`\`\`${deletedCourses} \`\`\``);
    log(
      msg.guild,
      `${msg.author} bulk deleted: \`\`\`${deletedCourses} \`\`\`\nContext: ${msg.url}`
    );
  },
};
