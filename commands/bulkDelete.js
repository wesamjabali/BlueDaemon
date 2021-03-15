const log = require("./helpers/log");
module.exports = {
  name: "bulkdelete",
  description: "Bulk delete courses, separated by a space.",
  facultyOnly: false,
  privileged: true,
  usage: ".bulkdelete <courses>+",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length < 2) {
      msg.channel.send(
        `${msg.guild.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${module.exports.usage}\`\`\``
      );
      return;
    }

    // Find quarter category
    let category = client.channels.cache.find(
      (c) => c.name == msg.guild.config.current_quarter && c.type == "category"
    );

    // Disable bulk create without quarter category.
    if (!category) {
      msg.channel.send(
        `No category found for ${msg.guild.config.current_quarter}.`
      );
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
        (r) => r.name === `${msg.guild.config.current_quarter}-${courseName}`
      );
      const existingChannel = msg.guild.channels.cache.find(
        (c) => c.name === courseName && c.parent == category
      );
      if (existingRole) {
        existingRole.delete();
      }
      if (existingChannel) {
        existingChannel.delete();
      }
      if (!existingRole && !existingChannel) {
        msg.channel.send(
          `Non-existant course: \`${msg.guild.config.current_quarter}-${courseName}\``
        );
        return;
      }
      deletedCourses.push(courseName);
    });

    msg.channel.send(`Courses deleted: \`\`\`${deletedCourses} \`\`\``);
    log(
      msg.guild,
      `${msg.author} bulk deleted: \`\`\`${deletedCourses} \`\`\`\nContext: ${msg.url}`
    );
  },
};
