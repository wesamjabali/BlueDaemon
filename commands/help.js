const config = require("../config.json");
module.exports = {
  name: "help",
  description: "Display help message",
  execute(msg, isModerator, client) {
    let courses = [];
    let selfRoles = [];
    let roles = msg.guild.roles.cache.filter((role) =>
      role.name.startsWith(config.currentQuarter + "-")
    );
    roles.forEach((s) => {
      courses.push(s.name.split("-").splice(1).join("-").toUpperCase());
    });
    courses.sort();

    const rolesList = msg.guild.roles.cache.filter((r) =>
      r.name.startsWith(config.selfRolePrefix + "-")
    );
    rolesList.forEach((s) => {
      selfRoles.push(s.name.split("-").splice(1).join("-"));
    });
    selfRoles.sort();
    // Moderator help
    if (isModerator) {
      msg.channel.send(
        `
Moderator Commands:
\`\`\`
.help                        > View this message

.courses                     > See list of courses
.join <course> <password?>   > Join a course
.leave <course>              > Leave a course
.create <course> <password?> > Create a course
.delete <course>             > Delete a course
.lock <course> <password>    > Lock a course
.unlock <course>             > Unlock a course

.roles                       > See list of roles
.role <join/leave> <role>    > Join/leave a role
.role <create/delete> <role> > Create/delete a role

.source                      > Show source
\`\`\`Available courses:\`\`\`` +
          courses +
          ` \`\`\`Available roles: \`\`\`` +
          selfRoles +
          ` \`\`\`
\`Need something else? DM @wesam\``
      );
    }
    // User help
    if (!isModerator) {
      msg.channel.send(
        `
Commands:
\`\`\`
.help                      > View this message

.courses                   > See list of courses
.join <course> <password?> > Join a course
.leave <course>            > Leave a course

.roles                     > See list of roles
.role <join/leave> <role>  > Join/leave a role

.source                    > Show my source code
\`\`\`Available courses:\`\`\`` +
          courses +
          ` \`\`\`Available roles: \`\`\`` +
          selfRoles +
          ` \`\`\`
\`Need something else? DM @wesam\``
      );
    }
  },
};
