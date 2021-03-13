const config = require("../config.json");
module.exports = {
  name: "bulkcreate",
  description: "Bulk create unprotected courses, separated by a space.",
  privileged: true,
  usage: config.prefix + "bulkcreate <courses>+",
  execute(msg, isModerator, client) {
    if (msg.args.length < 2) {
      msg.channel.send(
        `${config.prefix}${this.name}:\`\`\`${this.description}\`\`\`\nUsage:\`\`\`${this.usage}\`\`\``
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
    msg.args.forEach((arg) => {
      courseNames.push(arg);
    });

    const modRole = msg.guild.roles.cache.find(
      (r) => r.name === config.modRoleName
    );

    var createdCourses = [];
    courseNames.forEach((courseName) => {
      let existingRole = msg.guild.roles.cache.find(
        (r) => r.name === `${config.currentQuarter}-${courseName}`
      );
      if (existingRole) {
        msg.channel.send(`Duplicate role: \`${existingRole.name}\``);
        return;
      }
      createdCourses.push(courseName);
      msg.guild.roles
        .create({
          data: {
            name: `${config.currentQuarter}-${courseName}`,
          },
        })
        .then((r) => {
          msg.guild.channels.create(courseName, {
            type: "text",
            parent: category,
            permissionOverwrites: [
              {
                id: msg.guild.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: r.id,
                allow: ["VIEW_CHANNEL"],
              },
              { id: modRole.id, allow: ["VIEW_CHANNEL"] },
            ],
          });
        });
    });
    msg.channel.send(
      `Courses created: \`\`\`${createdCourses.join("\n")} \`\`\``
    );
  },
};
