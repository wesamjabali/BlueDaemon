require("dotenv").config();
const Discord = require("discord.js");
const knex = require("./knex");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const client = new Discord.Client();
const modRoleName = "Moderator";
const currentQuarter = "spring21";
const selfRolePrefix = "dpu";
const prefix = ".";

client.on("ready", () => {
  knex.migrate.latest();
  client.user.setActivity(currentQuarter + " | .help");
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("guildMemberAdd", (mem) => {
  mem.createDM().then((dm) => {
    dm.send(
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
});
// Bot user commands
client.on("message", (msg) => {
  if (msg.channel.type === "dm" && !msg.author.bot) {
    msg.reply("I can't help here! Use #bot-usage instead.");
    return;
  }

  // Prefix commands
  if (msg.content.startsWith(prefix)) {
    msg.content = msg.content.substring(1);
    let classes = [];
    let selfRoles = [];

    // Responds with help message
    if (msg.content === "help" && !msg.author.bot) {
      var roles = msg.guild.roles.cache.filter((role) =>
        role.name.startsWith(currentQuarter + "-")
      );
      roles.forEach((s) => {
        classes.push(s.name.split("-").splice(1).join("-").toUpperCase());
      });
      classes.sort();

      const selfRolesR = msg.guild.roles.cache.filter((r) =>
        r.name.startsWith(selfRolePrefix)
      );
      selfRolesR.forEach((s) => {
        selfRoles.push(s.name.split("-").splice(1).join("-"));
      });
      selfRoles.sort();

      msg.channel.send(
        `Commands:
\`\`\`
.join <course> <password?> - joins a course
.leave <course> - leaves a course
.role <join/leave> <role>  - joins/leaves a special role
\`\`\`
Available courses:
\`\`\`` +
          classes +
          ` \`\`\`
Available roles:
\`\`\` ` +
          selfRoles +
          `\`\`\``
      );
    }

    if (msg.content.startsWith("role ")) {
      let command = msg.content.split(" ");
      if (command.length != 3) {
        msg.channel.send(
          "Usage: ```.role <join/leave/create/delete> <role>```"
        );
        return;
      }
      const roleName = selfRolePrefix + "-" + command[2];

      if (command[1] === "create") {
        if (msg.member.roles.cache.find((r) => r.name === modRoleName)) {
          msg.guild.roles
            .create({
              data: {
                name: roleName,
              },
            })
            .then(() => {
              msg.channel.send(roleName + " created!");
            });
        } else {
          msg.channel.send(
            "Only people with " + modRoleName + " role can create roles."
          );
        }
        return;
      }
      const role = msg.guild.roles.cache.find(
        (r) => r.name.toLowerCase() === roleName.toLowerCase()
      );
      if (!role) {
        msg.channel.send("That role doesn't exist.");
        return;
      }

      if (command[1] === "delete") {
        if (msg.member.roles.cache.find((r) => r.name === modRoleName)) {
          const role = msg.guild.roles.cache.find(
            (r) => r.name.toLowerCase() === roleName.toLowerCase()
          );
          role.delete();
          msg.channel.send(roleName + " deleted!");
        } else {
          msg.channel.send(
            "Only people with " + modRoleName + " role can create roles."
          );
        }
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
        msg.channel.send("Role added!");
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
    if (msg.content.startsWith("join ")) {
      let command = msg.content.split(" ");
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

      requiresPassword(roleName).then((protected) => {
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
          verifyPassword(roleName, command[2]).then((verified) => {
            if (!verified) {
              msg.channel.send("Wrong password!");
            } else {
              let role = msg.guild.roles.cache.find(
                (r) => r.name.toUpperCase() === roleName.toUpperCase()
              );
              msg.member.roles.add(role);
              msg.delete();
              msg.channel.send("Course added, " + msg.author.toString());
            }
          });
        }
      });
    }

    // Leave a role
    if (msg.content.startsWith("leave ")) {
      let command = msg.content.split(" ");
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
        msg.channel.send("Role " + roleName + " not found!");
      }
    }

    // Mods only commands
    if (msg.member.roles.cache.find((r) => r.name === modRoleName)) {
      let category = client.channels.cache.find(
        (c) => c.name == currentQuarter && c.type == "category"
      );

      // Create new role/channel
      if (msg.content.startsWith("create ")) {
        let command = msg.content.split(" ");
        if (command.length < 2 || command.length > 3) {
          msg.channel.send("Usage: ```.create <classname> <password>```");
          return;
        }
        const roleName = currentQuarter + "-" + command[1];
        const modRole = msg.guild.roles.cache.find(
          (r) => r.name === modRoleName
        );

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
              msg.author.createDM().then((dm) => {
                dm.send(
                  "Password created: " +
                    "```" +
                    roleName +
                    ": " +
                    command[2] +
                    "```"
                );
              });

              protectRole(command[1], command[2]);
              msg.channel.send(command[1] + " created with password!");
            } else {
              msg.channel.send(command[1] + " created!");
            }
          })
          .catch(() => {
            msg.channel.send("Error creating role.");
          });
      }
    }

    // Delete role/channel
    if (msg.content.startsWith("delete ")) {
      let command = msg.content.split(" ");
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
        msg.channel.send(command[1] + " deleted successfully!");
        return;
      }

      msg.channel.send(command[1] + " not found!");
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
