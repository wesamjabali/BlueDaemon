const config = require("../config.json");
module.exports = {
  name: "courses",
  description: "Display available courses",
  execute(msg, isModerator, client) {
    let courses = [];
    let roles = msg.guild.roles.cache.filter((role) =>
      role.name.startsWith(config.currentQuarter + "-")
    );
    roles.forEach((s) => {
      courses.push(s.name.split("-").splice(1).join("-").toUpperCase());
    });
    courses.sort();

    msg.channel.send("Use `.join`:```" + courses + " ```");
  },
};
