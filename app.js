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
  // client.admin.send("I was offline, but I'm back now!");
  client.user.setActivity(".help");
});

/* Clean up database once it leaves a server. */
client.on("guildDelete", async (guild) => {
  await knex("cdm_role_password")
    .where({
      guild_id: guild.id,
    })
    .delete();

  await knex("cdm_guild_config")
    .where({
      guild_id: guild.id,
    })
    .delete();
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
  /* This is nuked for now, as DMs are reserved for setup */
  if (msg.channel.type === "dm") {
    return;
    /* if (!msg.content.startsWith(".")) {
    client.admin.send(`${msg.author}: ${msg.content}\n`);
    msg.channel.send("I can't help here. Use `.help` in the server.");
    }
    msg.guild = { config: { primary_color: "#658fe8", prefix: "." } };
    console.log(msg.guild);
    msg.content = msg.content.toLowerCase();

    if (msg.content == ".help") {
      client.commands.get("help").execute(msg, false, false, client);
      return;
    } else if (msg.content.length > 1) {
      client.admin.send(`${msg.author}: .${msg.content}\n`);
      msg.channel.send(
        `Only \`.help\` can be used here. Other commands need to be done in the server.`
      );
    }
    return; */
  }

  /* Get guild's config */
  [msg.guild.config] = await knex("cdm_guild_config")
    .select(
      "guild_id",
      "prefix",
      "mod_role",
      "faculty_role",
      "log_channel",
      "current_quarter",
      "self_role_prefix",
      "primary_color",
      "server_description"
    )
    .where({ guild_id: msg.guild.id });
  if (msg.guild.config && msg.content == ".setup") {
    return;
  } else if (
    !msg.guild.config &&
    msg.content.startsWith(".") &&
    msg.content != ".setup"
  ) {
    msg.channel.send("I'm not configured! Use `.setup` to set your server up.");
    return;
  } else if (msg.content == ".setup") {
    require("./commands/admin/setup").execute(msg, false, false, client);
    return;
  }

  /* React to mentions */
  if (msg.mentions.members && msg.mentions.members.size > 0) {
    if (msg.mentions.members.first().id == client.user.id) {
      msg.react("👀");
    }
  }

  let isModerator = !!msg.member.roles.cache.find(
    (r) => r.id === msg.guild.config.mod_role
  );
  let isFaculty = !!msg.member.roles.cache.find(
    (r) => r.id === msg.guild.config.faculty_role
  );

  /* Catch missing prefix joins so passwords don't get out */
  if (msg.content.startsWith("join")) {
    msg.content = msg.content.replace(/ +(?= )/g, ""); // Remove duplicate spaces
    if (msg.content.split(" ").length == 3) {
      msg.delete();
      const sentMessage = await msg.channel.send(
        `You may have forgotten the prefix, ${msg.author}\nTry \`${msg.guild.config.prefix}join\` instead.`
      );
      setTimeout(() => sentMessage.delete(), 6000);
    }
  }

  /* Commands */
  if (msg.content.startsWith(msg.guild.config.prefix)) {
    /* Prepare arguments, attach to message. */
    msg.content = msg.content.replace(/ +(?= )/g, ""); // Remove duplicate spaces
    msg.content = msg.content.substring(msg.guild.config.prefix.length); // Remove prefix
    msg.args = msg.content.split(" "); // Split into an arg array
    msg.args[0] = msg.args[0].toLowerCase();

    /* If command exists, do it. */
    const command = client.commands.get(msg.args[0]);
    if (command) {
      let allowed = false;
      /* If command is locked */
      if (command.privileged || command.facultyOnly) {
        if (isModerator) allowed = true;
        if (isFaculty && command.facultyOnly) allowed = true;
      } else {
        /* If not locked */
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
