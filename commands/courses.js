const config = require("../config.json");
const Discord = require("discord.js");

module.exports = {
  name: "courses",
  description: "Display available courses",
  privileged: false,
  usage: config.prefix + "courses",
  execute(msg, isModerator, client) {
    let courses = [];
    let roles = msg.guild.roles.cache.filter((role) =>
      role.name.startsWith(config.currentQuarter + "-")
    );
    roles.forEach((s) => {
      courses.push({
        name: s.name
          .split("-")
          .splice(config.prefix.length)
          .join("-")
          .toUpperCase(),
        value: "\u200B",
        inline: true,
      });
    });
    courses.sort();

    const coursesEmbed = new Discord.MessageEmbed()
      .setTitle("Courses")
      .setFooter(`Use ${config.prefix}join <coursename>`)
      .addFields(courses);

    msg.channel.send(coursesEmbed);
  },
};
