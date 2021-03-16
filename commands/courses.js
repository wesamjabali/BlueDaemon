const Discord = require("discord.js");
const _ = require("lodash");

module.exports = {
  name: "courses",
  description: "Display available courses",
  facultyOnly: false,
  privileged: false,
  usage: "courses",
  execute: async (msg, isModerator, isFaculty, client) => {
    let courses = [];
    let roles = msg.guild.roles.cache.filter((role) =>
      role.name.startsWith(msg.channel.config.current_quarter + "-")
    );
    roles.forEach((s) => {
      courses.push({
        name: `\`\`\`${s.name
          .split("-")
          .splice(msg.channel.config.prefix.length)
          .join("-")
          .toUpperCase()}\`\`\``,
        value: "\u200B",
        inline: true,
      });
    });

    /* Sort alphabetically by name */
    courses.sort((a, b) => {
      if (a.name > b.name) return 1;
      else return -1;
    });

    const embedFieldLimit = 24;
    var courseChunks = _.chunk(courses, embedFieldLimit); // Split into groups of 24

    /* Page one */
    const pageOneEmbed = new Discord.MessageEmbed()
      .setTitle("Courses")
      .setFooter(`${msg.channel.config.prefix}join <coursename>  |  1`)
      .setColor(msg.channel.config.primary_color)
      .addFields(courseChunks[0]);

    await msg.channel.send(pageOneEmbed);

    /* The rest of the pages */
    for (var i = 1; i < courseChunks.length; i++) {
      const newPageEmbed = new Discord.MessageEmbed()
        .setFooter(`${msg.channel.config.prefix}join <coursename>  |  ${i + 1}`)
        .setColor(msg.channel.config.primary_color)
        .addFields(courseChunks[i]);
      await msg.channel.send(newPageEmbed);
    }
  },
};
