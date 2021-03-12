require("dotenv").config();
const Discord = require("discord.js");
const knex = require("./knex");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const client = new Discord.Client();
const modRoleName = "Moderator";
const adminID = "539910274698969088";
const currentQuarter = "spring21";
const selfRolePrefix = "dpu";
const prefix = ".";
let admin;

client.users
  .fetch(adminID)
  .then((u) => {
    admin = u;
  })
  .catch((err) => {
    console.log(
      "Error getting Admin user. This may cause instability.\n" + err
    );
  });

client.on("ready", () => {
  knex.migrate.latest();
  client.user.setActivity(currentQuarter + " | .help");
  console.log(`Logged in as ${client.user.tag}!`);
});

/* Welcome Message */
client.on("guildMemberAdd", (mem) => {
  mem.send(
    `
> **Welcome to CDM Discussions!**
> __The central hub for all CDM classes and discussions__
> _I'm **BlueDaemon**, your course-management assistant!_

**Use the commands below to join your courses!**
\`\`\`
.help                    > See all courses/commands
.join classname          > Join a course
.join classname password > Join a protected course
.role join leetcoder     > Get notified of daily leetcoding sessions
\`\`\`
\`Having trouble? DM @wesam\`

_Have a great quarter!_
`
  );
});
/* Message listener */
client.on("message", (msg) => {
  // Don't respond to bots
  if (msg.author.bot) {
    return;
  }
  /* Deny DMs */
  if (msg.channel.type === "dm") {
    admin.send(
      "I got a message! \n" + msg.author.toString() + ": " + msg.content
    );
    msg.reply("I can't help here! Use #bot-usage instead.");
    return;
  }

  /* React to mentions */
  if (msg.mentions.members && msg.mentions.members.size > 0) {
    if (msg.mentions.members.first().id == client.user.id) {
      msg.react("👀");
    }
  }
  /* Prefix commands */
  if (msg.content.startsWith(prefix)) {
    let isModerator = !!msg.member.roles.cache.find(
      (r) => r.name === modRoleName
    );
    msg.content = msg.content.replace(/ +(?= )/g, ""); // Normalize spaces with a regex
    msg.content = msg.content.substring(1); // Remove the prefix
    let command = msg.content.split(" "); // Split into a command array

    /* DMs help text, depending on role. */
    if (msg.content === "help") {
      let courses = [];
      let selfRoles = [];
      let roles = msg.guild.roles.cache.filter((role) =>
        role.name.startsWith(currentQuarter + "-")
      );
      roles.forEach((s) => {
        courses.push(s.name.split("-").splice(1).join("-").toUpperCase());
      });
      courses.sort();

      const rolesList = msg.guild.roles.cache.filter((r) =>
        r.name.startsWith(selfRolePrefix + "-")
      );
      rolesList.forEach((s) => {
        selfRoles.push(s.name.split("-").splice(1).join("-"));
      });
      selfRoles.sort();
      msg.channel.send("I've DM'd your request, " + msg.author.toString());
      // Moderator help
      if (isModerator) {
        msg.author.send(
          `
Moderator Commands:
\`\`\`
.help                        > View this message

.courses                     > See list of courses
.join <course> <password?>   > Join a course
.leave <course>              > Leave a course
.create <course> <password?> > Create a course
.delete <course>             > Delete a course

.roles                       > See list of roles
.role <join/leave> <role>    > Join/leave a role
.role <create/delete> <role> > Create/delete a role

.source                      > Show my source code
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
        msg.author.send(
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
    }

    if (msg.content === "source") {
      msg.channel.send(`
Author: Wesam Jabali
Source: https://github.com/wesamjabali/BlueDaemon
      `);
    }

    if (command[0] === "courses") {
      let courses = [];
      let roles = msg.guild.roles.cache.filter((role) =>
        role.name.startsWith(currentQuarter + "-")
      );
      roles.forEach((s) => {
        courses.push(s.name.split("-").splice(1).join("-").toUpperCase());
      });
      courses.sort();

      msg.channel.send("Courses:```" + courses + " ```");
    }

    if (command[0] === "roles") {
      let selfRoles = [];
      const rolesList = msg.guild.roles.cache.filter((r) =>
        r.name.startsWith(selfRolePrefix + "-")
      );
      rolesList.forEach((s) => {
        selfRoles.push(s.name.split("-").splice(1).join("-"));
      });
      selfRoles.sort();

      msg.channel.send("Roles:```" + selfRoles + " ```");
    }

    if (command[0] === "role") {
      if (command.length != 3) {
        msg.channel.send("Usage: ```.role <join/leave> <role>```");
        return;
      }
      const roleName = selfRolePrefix + "-" + command[2];

      if (command[1] === "create") {
        // Check if mod
        if (isModerator) {
          if (msg.guild.roles.cache.find((r) => r.name === roleName)) {
            msg.channel.send(
              "That role already exists, " + msg.author.toString()
            );
            return;
          }
          msg.guild.roles
            .create({
              data: {
                name: roleName,
              },
            })
            .then(() => {
              msg.channel.send(roleName + " created, " + msg.author.toString());
            })
            .catch(() => {
              msg.channel.send("Error creating role.");
              admin.send(
                "There was an error creating a role for " +
                  msg.author.toString()
              );
            });
        } else {
          msg.channel.send(
            "Only people with " +
              modRoleName +
              " role can create roles, " +
              msg.author.toString()
          );
        }
        return;
      }
      const role = msg.guild.roles.cache.find(
        (r) => r.name.toLowerCase() === roleName.toLowerCase()
      );

      if (command[1] === "delete") {
        // Check if mod
        if (isModerator) {
          const role = msg.guild.roles.cache.find(
            (r) => r.name.toLowerCase() === roleName.toLowerCase()
          );
          if (!role) {
            msg.channel.send(
              "That role doesn't exist, " + msg.author.toString()
            );
            return;
          }
          role.delete();
          msg.channel.send(roleName + " deleted, " + msg.author.toString());
        } else {
          msg.channel.send(
            "Only people with " +
              modRoleName +
              " role can delete roles, " +
              msg.author.toString()
          );
          return;
        }
      }
      if (!role) {
        msg.channel.send("That role doesn't exist.");
        return;
      }
      if (command[1] === "join") {
        if (
          msg.member.roles.cache.find(
            (r) => r.name.toLowerCase() === roleName.toLowerCase()
          )
        ) {
          msg.channel.send(
            "You are already in that role, " + msg.author.toString()
          );
          return;
        }
        msg.member.roles.add(role);
        msg.channel.send("Role added, " + msg.author.toString());
      } else if (command[1] === "leave") {
        const role = msg.member.roles.cache.find(
          (r) => r.name.toLowerCase() === roleName.toLowerCase()
        );
        msg.member.roles.remove(role);
        msg.channel.send(
          "Removed from " + roleName + ", " + msg.author.toString()
        );
        return;
      }
    }

    // Joins course role
    if (command[0] === "join") {
      if (command.length < 2 || command.length > 3) {
        msg.channel.send("Usage: ```.join <classname> <password?>```");
        return;
      }

      let roleName = currentQuarter + "-" + command[1];
      if (msg.member.roles.cache.find((r) => r.name === roleName)) {
        msg.channel.send(
          "You are already in that course, " + msg.author.toString()
        );
        return;
      }

      requiresPassword(roleName)
        .then((protected) => {
          if (protected && command.length == 2) {
            msg.channel.send(
              "Ask your professor to join " +
                command[1] +
                ", " +
                msg.author.toString()
            );
            return;
          }
          let role = msg.guild.roles.cache.find(
            (r) => r.name.toUpperCase() === roleName.toUpperCase()
          );
          if (!role) {
            msg.channel.send("That role doesn't exist.");
          } else if (role && !protected) {
            msg.member.roles.add(role);
            msg.channel.send("Course added, " + msg.author.toString());
          } else if (role && protected) {
            verifyPassword(roleName, command[2])
              .then((verified) => {
                if (!verified) {
                  msg.delete();
                  msg.channel.send("Wrong password, " + msg.author.toString());
                } else {
                  let role = msg.guild.roles.cache.find(
                    (r) => r.name.toUpperCase() === roleName.toUpperCase()
                  );
                  msg.member.roles.add(role);
                  msg.delete();
                  msg.channel.send("Course added, " + msg.author.toString());
                }
              })
              .catch(() => {
                msg.channel.send("Error verifying password.");
                admin.send(
                  "There was an error verifying the password for " +
                    msg.author.toString()
                );
              });
          }
        })
        .catch(() => {
          msg.channel.send("Error checking password lock.");
          admin.send(
            "There was an error checking password lock for " +
              msg.author.toString()
          );
        });
    }

    // Leave a role
    if (command[0] === "leave") {
      if (command.length != 2) {
        msg.channel.send("Usage: ```.leave <classname>```");
        return;
      }
      let roleName = currentQuarter + "-" + command[1];
      let role = msg.member.roles.cache.find(
        (r) => r.name.toUpperCase() === roleName.toUpperCase()
      );
      if (role) {
        msg.member.roles.remove(role);
        msg.channel.send(
          "Removed from " +
            command[1].toUpperCase() +
            ", " +
            msg.author.toString() +
            "!"
        );
      } else {
        msg.channel.send(
          "Role " + roleName + " not found," + msg.author.toString()
        );
      }
    }

    // Mods only commands
    if (isModerator) {
      // Create new role/channel
      if (command[0] === "create") {
        if (command.length < 2 || command.length > 3) {
          msg.channel.send("Usage: ```.create <classname> <password>```");
          return;
        }
        let category = client.channels.cache.find(
          (c) => c.name == currentQuarter && c.type == "category"
        );
        const roleName = currentQuarter + "-" + command[1];
        const modRole = msg.guild.roles.cache.find(
          (r) => r.name === modRoleName
        );
        if (msg.guild.roles.cache.find((r) => r.name === roleName)) {
          msg.channel.send(
            "That course already exists, " + msg.author.toString()
          );
          return;
        }
        msg.guild.roles
          .create({
            data: {
              name: roleName,
            },
          })
          .then((r) => {
            msg.guild.channels.create(command[1], {
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
            if (command.length == 3) {
              msg.delete();
              /* Store passwords in author's DM in case of forgotten password.
              TODO:
              Consider whether this is necessary -- the passwords are hashed in the DB and
              this may defeat the purpose and you can always delete/recreate if a password was forgotten. */
              msg.author.send(
                "Password created: " +
                  "```" +
                  roleName +
                  ": " +
                  command[2] +
                  "```"
              );
              protectRole(command[1], command[2]);
              msg.channel.send(
                command[1] + " created with password, " + msg.author.toString()
              );
            } else {
              msg.channel.send(
                command[1] + " created, " + msg.author.toString()
              );
            }
          })
          .catch(() => {
            msg.channel.send("Error creating role, " + msg.author.toString());
            admin.send(
              "There was an error creating role for " + msg.author.toString()
            );
          });
      }

      // Delete role/channel
      if (command[0] === "delete") {
        let roleName = currentQuarter + "-" + command[1];

        if (command.length != 2) {
          msg.channel.send("Usage: ```.delete <classname>```");
          return;
        }

        const foundRole = msg.guild.roles.cache.find(
          (r) => r.name.toUpperCase() === roleName.toUpperCase()
        );
        if (foundRole) {
          foundRole.delete();
        }

        const foundChannel = msg.guild.channels.cache.find(
          (c) => c.name.toUpperCase() === command[1].toUpperCase()
        );
        if (foundChannel) {
          foundChannel.delete();
          deleteRole(roleName);
          msg.channel.send(
            command[1] + " deleted successfully, " + msg.author.toString()
          );
          return;
        }

        msg.channel.send(command[1] + " not found, " + msg.author.toString());
      }

      if (command[1] === "lock") {
      }
      // End mod only commands
    }
  }
});

/* Helper functions */

// Check if a role requires a password
async function requiresPassword(roleName) {
  const [protectedRole] = await knex("cdm_role_password")
    .where({ role_name: roleName })
    .select("*");
  return !!protectedRole;
}
// Verify a password is correct
async function verifyPassword(roleName, password) {
  const [protectedRole] = await knex("cdm_role_password")
    .where({ role_name: roleName })
    .select("password");
  return bcrypt.compareSync(password, protectedRole.password);
}

// Add a role and password to the DB.
async function protectRole(roleName, password) {
  let bcryptPass = bcrypt.hashSync(password, salt);
  await knex("cdm_role_password").insert({
    role_name: currentQuarter + "-" + roleName,
    password: bcryptPass,
  });
}

// Remove a role and password from the DB.
async function deleteRole(roleName) {
  await knex("cdm_role_password").where({ role_name: roleName }).delete();
}

client.login(process.env.CLIENT_TOKEN);
