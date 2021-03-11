require("dotenv").config();
const Discord = require("discord.js");
const knex = require("./knex");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const client = new Discord.Client();
const wesamID = "539910274698969088";
const botlogChannel = "780910494692802610";
const modRoleName = "Moderator";
const currentQuarter = "spring21";
const prefix = ".";

client.on("ready", () => {
  knex.migrate.latest();
  client.user.setActivity(currentQuarter + " | .help");
  console.log(`Logged in as ${client.user.tag}!`);
});

// Bot user commands
client.on("message", (msg) => {
  if (msg.channel.type === "dm" && !msg.author.bot) {
    msg.reply("I'd love to help, but I don't support DMs yet!");
    return;
  }
  if (msg.content.startsWith(prefix)) {
    msg.content = msg.content.substring(1);
    let classes = [];

    // Responds with help message
    if (msg.content === "help" && !msg.author.bot) {
      const roles = msg.guild.roles.cache.filter((role) =>
        role.name.startsWith(currentQuarter + "-")
      );
      roles.forEach((s) => {
        classes.push(s.name.split("-").splice(1).join("-").toUpperCase());
      });
      classes.sort();

      msg.channel.send(
        "```" +
          `.join <classname> <password?>
.leave <classname>` +
          "```\n" +
          "Available courses:```" +
          classes +
          "```"
      );
    }

    if (msg.content.startsWith("join")) {
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
          return;
        }
        if (role && !protected) {
          msg.member.roles.add(role);
          msg.channel.send("Course added, " + msg.author.toString());
          return;
        }
        if (role && protected) {
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

    async function requiresPassword(roleName) {
      const [protectedRole] = await knex("cdm_role_password")
        .where({ role_name: roleName })
        .select("*");
      return !!protectedRole;
    }

    async function verifyPassword(roleName, password) {
      const [protectedRole] = await knex("cdm_role_password")
        .where({ role_name: roleName })
        .select("password");
      return bcrypt.compareSync(password, protectedRole.password);
    }

    if (msg.content.startsWith("leave")) {
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
      if (msg.content.startsWith("create")) {
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

    async function protectRole(roleName, password) {
      let bcryptPass = bcrypt.hashSync(password, salt);
      await knex("cdm_role_password").insert({
        role_name: currentQuarter + "-" + roleName,
        password: bcryptPass,
      });
    }

    async function deleteRole(roleName) {
      await knex("cdm_role_password").where({ role_name: roleName }).delete();
    }
    // Delete role/channel
    if (msg.content.startsWith("delete")) {
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

client.login(process.env.CLIENT_TOKEN);
