const config = require("../config.json");
const protectRole = require("./helpers/protectRole");

module.exports = {
  name: "create",
  description: "Create a course",
  execute(msg, client) {
    if (msg.args.length < 2 || msg.args.length > 3) {
      msg.channel.send("Usage: ```.create <classname> <password>```");
      return;
    }
    let category = client.channels.cache.find(
      (c) => c.name == config.currentQuarter && c.type == "category"
    );
    const roleName = config.currentQuarter + "-" + msg.args[1];
    const modRole = msg.guild.roles.cache.find(
      (r) => r.name === config.modRoleName
    );
    if (msg.guild.roles.cache.find((r) => r.name === roleName)) {
      msg.channel.send("That course already exists, " + msg.author.toString());
      return;
    }
    msg.guild.roles
      .create({
        data: {
          name: roleName,
        },
      })
      .then((r) => {
        msg.guild.channels.create(msg.args[1], {
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
        if (msg.args.length == 3) {
          msg.delete();
          /* Store passwords in author's DM in case of forgotten password.
                TODO:
                Consider whether this is necessary -- the passwords are hashed in the DB and
                this may defeat the purpose and you can always delete/recreate if a password was forgotten. */
          msg.author.send(
            "Password created: " + "```" + roleName + ": " + msg.args[2] + "```"
          );
          protectRole(msg.args[1], msg.args[2])
            .then(() => {
              msg.channel.send(
                msg.args[1] + " created with password, " + msg.author.toString()
              );
            })
            .catch((err) => {
              console.log(err);
              msg.channel.send(
                "Error protecting course, " + msg.author.toString()
              );
            });
        } else {
          msg.channel.send(msg.args[1] + " created, " + msg.author.toString());
        }
      })
      .catch(() => {
        msg.channel.send("Error creating role, " + msg.author.toString());
        client.admin.send(
          "There was an error creating role for " + msg.author.toString()
        );
      });
  },
};
