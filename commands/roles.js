const config = require("../config.json");

module.exports = {
  name: "roles",
  description: "Display available roles",
  privileged: false,
  execute(msg, isModerator, client) {
    let selfRoles = [];
    const rolesList = msg.guild.roles.cache.filter((r) =>
      r.name.startsWith(config.selfRolePrefix + "-")
    );
    rolesList.forEach((s) => {
      selfRoles.push(s.name.split("-").splice(config.prefix.length).join("-"));
    });
    selfRoles.sort();

    msg.channel.send("Use `.role join`:```" + selfRoles + " ```");
  },
};
