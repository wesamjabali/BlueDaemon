require("dotenv").config();
const fs = require("fs");
const knex = require("./knex");
const config = require("./config.json");

const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

/* Listeners */
const guildMemberAdd = require("./listeners/guildMemberAdd");
const log = require("./commands/helpers/log");

/* Attach commands to client */
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}


/* Uncomment for debugging */
// client.on("debug", console.log).on("warn", console.log);

client.on("ready", async () => {
  knex.migrate.latest();
  console.log(`Logged in as ${client.user.tag}!`);
  /* Attach admin user to client */
  client.admin = await client.users.fetch(config.adminID);

  /* Notify */
  client.admin.send("I was offline, but I'm back now!");
  client.user.setActivity(config.currentQuarter + " | .help");
});

/* New User Listener*/
client.on("guildMemberAdd", (member) => {
  guildMemberAdd.execute(member, client);
});

/* Message listener */
client.on("message", async (msg) => {
  /* Don't listen to bots */
  if (msg.author.bot) {
    return;
  }

  /* Catch DMs */
  if (msg.channel.type === "dm") {
    if (!msg.content.startsWith(config.prefix)) {
      client.admin.send(`${msg.author}: ${msg.content}\n`);
      return;
    }

    msg.content = msg.content.replace(/ +(?= )/g, ""); // Remove duplicate spaces
    msg.content = msg.content.substring(config.prefix.length); // Remove prefix
    msg.args = msg.content.split(" "); // Split into an arg array
    msg.args[0] = msg.args[0].toLowerCase();

    if (msg.args[0] == "help") {
      client.commands.get("help").execute(msg, false, false, client);
      return;
    } else {
      client.admin.send(`${msg.author}: ${config.prefix}${msg.content}\n`);
      msg.channel.send(
        `Only ${config.prefix}\`help\` can be used here. Other commands need to be done in the server.`
      );
      return;
    }
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
  let isFaculty = !!msg.member.roles.cache.find(
    (r) => r.name === config.facultyRoleName
  );

  /* Catch missing prefix joins */
  if (msg.content.startsWith("join")) {
    msg.content = msg.content.replace(/ +(?= )/g, ""); // Remove duplicate spaces
    if (msg.content.split(" ").length == 3) {
      msg.delete();
      const sentMessage = await msg.channel.send(
        `You may have forgotten the prefix, ${msg.author}\nTry \`${config.prefix}join\` instead.`
      );
      setTimeout(() => sentMessage.delete(), 6000);
    }
  }

  /* Commands */
  if (msg.content.startsWith(config.prefix)) {
    /* Prepare arguments, attach to message. */
    msg.content = msg.content.replace(/ +(?= )/g, ""); // Remove duplicate spaces
    msg.content = msg.content.substring(config.prefix.length); // Remove prefix
    msg.args = msg.content.split(" "); // Split into an arg array
    msg.args[0] = msg.args[0].toLowerCase();

    /* If command exists, do it. */
    const command = client.commands.get(msg.args[0]);
    if (command) {
      let allowed = false;
      if (command.privileged || command.facultyOnly) {
        if (isModerator) allowed = true;
        if (isFaculty && command.facultyOnly) allowed = true;
      } else {
        allowed = true;
      }
      if (allowed) {
        command.execute(msg, isModerator, isFaculty, client);
      }
    } else {
      const sentMessage = await msg.channel.send(
        `Bad command! Do \`.help\` for commands, ${msg.author}`
      );
      setTimeout(() => sentMessage.delete(), 3000);
    }
  }
});
client.login(process.env.CLIENT_TOKEN);
