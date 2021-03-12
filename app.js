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
  if (msg.channel.type === "dm" && msg.content.toLowerCase() != ".help") {
    client.admin.send(
      "I got a message! \n" + msg.author.toString() + ": " + msg.content
    );
    msg.reply(
      "I can't help here! Use #bot-usage instead.\n\nhttps://discord.gg/r4PUkXeWhf"
    );
    return;
  }

  if (msg.content.toLowerCase() == ".help") {
    client.commands.get("help").execute(msg, false, client);
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
    msg.content = msg.content.replace(/ +(?= )/g, ""); // Remove duplicate spaces
    msg.content = msg.content.substring(config.prefix.length).toLowerCase(); // Remove prefix
    msg.args = msg.content.split(" "); // Split into an arg array

    /* If command exists, do it. */
    const command = client.commands.get(msg.args[0]);
    if (command) {
      command.execute(msg, isModerator, client);
    }
  }
});
client.login(process.env.CLIENT_TOKEN);
