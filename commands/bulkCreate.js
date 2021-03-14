const config = require("../config.json");
const log = require("./helpers/log");
module.exports = {
  name: "bulkcreate",
  description: "Bulk create unprotected courses, separated by a space.",
  facultyOnly: false,
  privileged: true,
  usage: config.prefix + "bulkcreate <courses>+",
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
      msg.channel.send(
        `No category found for ${config.currentQuarter}. Use \`${config.prefix}create\` then try again.`
      );
      return;
    }

    let courseNames = [];
    msg.args.shift();
    msg.args.sort();
    msg.args.forEach((arg) => {
      courseNames.push(arg.toLowerCase());
    });

    const modRole = msg.guild.roles.cache.find(
      (r) => r.name === config.modRoleName
    );

    var createdCourses = [];
    courseNames.forEach((courseName) => {
      const existingRole = msg.guild.roles.cache.find(
        (r) => r.name === `${config.currentQuarter}-${courseName}`
      );
      if (existingRole) {
        msg.channel.send(`Duplicate role: \`${existingRole.name}\``);
        return;
      } else {
        createdCourses.push(courseName);
      }
    });

    createdCourses.forEach(async (courseName) => {
      const newRole = await msg.guild.roles.create({
        data: {
          name: `${config.currentQuarter}-${courseName}`,
        },
      });
      msg.guild.channels.create(courseName, {
        type: "text",
        parent: category,
        permissionOverwrites: [
          {
            id: msg.guild.id,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: newRole.id,
            allow: ["VIEW_CHANNEL"],
          },
          { id: modRole.id, allow: ["VIEW_CHANNEL"] },
        ],
      });
    });
    msg.channel.send(`Courses created: \`\`\`${createdCourses} \`\`\``);
    log(
      msg.guild,
      `${msg.author} bulk created: \`\`\`${createdCourses} \`\`\`\nContext: ${msg.url}`
    );
  },
};
