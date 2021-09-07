const log = require("./helpers/log");
module.exports = {
  name: "bulkcreate",
  description: "Bulk create unprotected courses, separated by a space.",
  facultyOnly: false,
  privileged: true,
  usage: "bulkcreate <courses>+",
  execute: async (msg, isModerator, isFaculty, client) => {
    if (msg.args.length < 2) {
      msg.channel.send(
        `${msg.channel.config.prefix}${module.exports.name}:\`\`\`${module.exports.description}\`\`\`\nUsage:\`\`\`${msg.channel.config.prefix}${module.exports.usage}\`\`\``
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
      (r) => r.id === msg.channel.config.mod_role
    );

    var createdCourses = [];
    courseNames.forEach((courseName) => {
      const existingRole = msg.guild.roles.cache.find(
        (r) => r.name === `${msg.channel.config.current_quarter}-${courseName}`
      );
      if (existingRole) {
        msg.channel.send(`Duplicate role: \`${existingRole.name}\``);
      } else {
        createdCourses.push(courseName);
      }
    });

    createdCourses.forEach(async (courseName) => {
      let categoryNumber = 1;
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
        categoryNumber++;

        let categoryName =
          categoryNumber === 1
            ? `${msg.channel.config.current_quarter}`.toUpperCase()
            : `${msg.channel.config.current_quarter}-${categoryNumber}`.toUpperCase();
        categoryNumber++;

        const newRole = await msg.guild.roles.create({
          data: {
            name: `${msg.channel.config.current_quarter}-${courseName}`,
          },
        });
        newChannel = msg.guild.channels.create(courseName, {
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
      }
    });
    msg.channel.send(`Courses created: \`\`\`${createdCourses} \`\`\``);
    log(
      msg.channel,
      `${msg.author} bulk created: \`\`\`${createdCourses} \`\`\`\nContext: ${msg.url}`
    );
  },
};
