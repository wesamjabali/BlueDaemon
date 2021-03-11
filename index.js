require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
const wesamID = "539910274698969088";
const botlogChannel = "780910494692802610";
const modRoleName = "Moderator";
const currentQuarter = "spring21";

const prefix = ".";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(currentQuarter + " | .help");
});

// Bot user commands
client.on("message", (msg) => {
  // if (msg.author.username === "") {
  //   msg.react("❤️");
  //   msg.channel.send(
  //     "I'm so happy you're here. Keep it up, " + msg.author.toString()
  //   );
  // }
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
          `.join <classname/password>
.leave <classname>` +
          "```\n" +
          "Available courses:```" +
          classes +
          "```"
      );
    }

    if (msg.content.startsWith("join")) {
      let command = msg.content.split(" ");
      if (command.length != 2) {
        msg.channel.send("Usage: ```.join <classname/password>```");
        return;
      }

      let roleName = currentQuarter + "-" + command[1];
      let role = msg.guild.roles.cache.find(
        (r) => r.name.toUpperCase() === roleName.toUpperCase()
      );
      if (role) {
        msg.member.roles.add(role);
        msg.channel.send(
          "Welcome to " +
            command[1].toUpperCase() +
            ", " +
            msg.author.toString() +
            "!"
        );
      } else {
        msg.channel.send("Role " + roleName + " not found!");
        // Do password join here
      }
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
        const modRole = msg.guild.roles.cache.find(
          (r) => r.name === modRoleName
        );

        msg.guild.roles
          .create({
            data: {
              name: currentQuarter + "-" + command[1],
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
            msg.channel.send(
              "Role and private channel for " + command[1] + " created!"
            );
          })
          .catch(() => {
            msg.channel.send("Error creating role.");
          });

        if (command.length == 3) {
        }
      }
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
        msg.channel.send(command[1] + " deleted successfully!");
        return;
      }

      msg.channel.send(command[1] + " not found!");
    }
  }
});

client.login(process.env.CLIENT_TOKEN);
