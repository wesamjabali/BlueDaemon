require("dotenv").config();
const fs = require("fs");
const knex = require("./knex");
const config = require("./config.json");

const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

/* Listeners */
const guildMemberAdd = require("./listeners/guildMemberAdd");

/* Attach commands to client */
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

/* Attach admin user to client */
client.users
  .fetch(config.adminID)
  .then((u) => {
    client.admin = u;
  })
  .catch((err) => {
    console.log(
      "Error getting Admin user. This may cause instability.\n" + err
    );
  });

/* Uncomment for debugging */
// client.on("debug", console.log).on("warn", console.log);

client.on("ready", () => {
  knex.migrate.latest();
  client.user.setActivity(config.currentQuarter + " | .help");
  console.log(`Logged in as ${client.user.tag}!`);
});

/* New User Listener*/
client.on("guildMemberAdd", (member) => {
  guildMemberAdd.execute(member);
});

/* Message listener */
client.on("message", (msg) => {
  /* Don't listen to bots */
  if (msg.author.bot) {
    return;
  }

  /* Deny DMs */
  if (msg.channel.type === "dm") {
    client.admin.send(
      "I got a message! \n" + msg.author.toString() + ": " + msg.content
    );
    msg.reply(
      "I can't help here! Use #bot-usage instead.\n\nhttps://discord.gg/r4PUkXeWhf"
    );
    return;
  }

  /* React to mentions */
  if (msg.mentions.members && msg.mentions.members.size > 0) {
    if (msg.mentions.members.first().id == client.user.id) {
      msg.react("👀");
    }
  }

  let isModerator = !!msg.member.roles.cache.find(
    (r) => r.name === config.modRoleName
  );

  /* Commands */
  if (msg.content.startsWith(config.prefix)) {
    /* Prepare arguments, attach to message. */
    msg.content = msg.content.replace(/ +(?= )/g, ""); // Normalize spaces with a regex
    msg.content = msg.content.substring(1).toLowerCase(); // Remove the .
    msg.args = msg.content.split(" "); // Split into a command array

    if (msg.content === "help") {
      client.commands.get("help").execute(msg, isModerator);
    } else if (msg.content === "source") {
      client.commands.get("source").execute(msg);
    } else if (msg.args[0] === "courses") {
      client.commands.get("courses").execute(msg);
    } else if (msg.args[0] === "roles") {
      client.commands.get("roles").execute(msg);
    } else if (msg.args[0] === "role") {
      client.commands.get("role").execute(msg, isModerator, client);
    } else if (msg.args[0] === "join") {
      client.commands.get("join").execute(msg, client);
    } else if (msg.args[0] === "leave") {
      client.commands.get("leave").execute(msg);
    }

    /* Mods only commands */
    if (isModerator) {
      if (msg.args[0] === "create") {
        client.commands.get("create").execute(msg, client);
      } else if (msg.args[0] === "delete") {
        client.commands.get("delete").execute(msg);
      } else if (msg.args[0] === "lock") {
        client.commands.get("lock").execute(msg);
      }
    }
  }
});
client.login(process.env.CLIENT_TOKEN);
