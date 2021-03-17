require("dotenv").config();
const fs = require("fs");
const knex = require("./knex");
const config = require("./config.json");
const _ = require("lodash");
const log = require("./commands/helpers/log");

const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

var allGuildConfigs = {};
var cooldownUsers = [];
const cooldownTime = 1500;

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

/* Uncomment for debugging */
// client.on("debug", console.log).on("warn", console.log);

client.on("ready", async () => {
  knex.migrate.latest();
  console.log(`Logged in as ${client.user.tag}!`);
  /* Attach admin user to client */
  client.admin = await client.users.fetch(config.adminID);

  /* Notify */
  // client.admin.send("I was offline, but I'm back now!");
  client.user.setActivity("say .help");
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
  /* DMs are reserved for setup */
  if (msg.channel.type === "dm") {
    console.log(cooldownUsers);

    console.log(`${msg.author.username}: ${msg.content}`); // For feedback on how people _would_ use the DMs if they existed.
    if (msg.content.toLowerCase().startsWith(".help")) {
      if (!cooldownUsers.includes(msg.author.id)) {
        addCooldown(msg.author.id);
        client.commands.get("help").execute(msg, false, false, client);
      } else {
        addCooldown(msg.author.id);
        msg.reply("You're doing that too fast.");
      }
    }
    return;
  }

  /* Cut down _hard_ on database requests. Save configs in RAM. */
  if (!allGuildConfigs[msg.channel.id]) {
    /* Get guild's config */
    [msg.channel.config] = await knex("cdm_guild_config")
      .select(
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
    allGuildConfigs[msg.channel.id] = msg.channel.config;
    if (msg.channel.config && msg.content == ".setup") {
      return;
    } else if (
      !msg.channel.config &&
      msg.content.startsWith(".") &&
      msg.content != ".setup"
    ) {
      msg.channel.send(
        "I'm not configured! Use `.setup` to set your server up."
      );
      return;
    } else if (msg.content == ".setup") {
      require("./commands/admin/setup").execute(msg, false, false, client);
      return;
    } else if (!msg.channel.config) {
      return;
    }
  } else {
    msg.channel.config = allGuildConfigs[msg.channel.id];
  }

  /* React to mentions */
  if (msg.mentions.members && msg.mentions.members.size > 0) {
    if (msg.mentions.members.first().id == client.user.id) {
      msg.react("👀");
    }
  }

  let isModerator = !!msg.member.roles.cache.find(
    (r) => r.id === msg.channel.config.mod_role
  );
  let isFaculty = !!msg.member.roles.cache.find(
    (r) => r.id === msg.channel.config.faculty_role
  );

  /* Catch missing prefix joins so passwords don't get out */
  if (msg.content.startsWith("join")) {
    msg.content = msg.content.replace(/ +(?= )/g, ""); // Remove duplicate spaces
    if (msg.content.split(" ").length == 3) {
      msg.delete();
      const sentMessage = await msg.channel.send(
        `You may have forgotten the prefix, ${msg.author}\nTry \`${msg.channel.config.prefix}join\` instead.`
      );
      setTimeout(() => sentMessage.delete(), 6000);
    }
  }

  /* Commands */
  if (msg.content.startsWith(msg.channel.config.prefix)) {
    if (!cooldownUsers.includes(msg.author.id)) {
      /* Prepare arguments, attach to message. */
      msg.content = msg.content.replace(/ +(?= )/g, ""); // Remove duplicate spaces
      msg.content = msg.content.substring(msg.channel.config.prefix.length); // Remove prefix
      msg.args = msg.content.split(" "); // Split into an arg array
      msg.args[0] = msg.args[0].toLowerCase();
      if (
        msg.args[0] == "" ||
        msg.args[0].startsWith(msg.channel.config.prefix)
      )
        return;
      addCooldown(msg.author.id);

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
        let sentMessage = await msg.channel.send(
          `Bad command! Do \`.help\` for commands, ${msg.author}`
        );
        setTimeout(() => sentMessage.delete(), 3000);
      }
    } else {
      const newMessage = await msg.channel.send(
        `You're doing commands too fast, ${msg.author}! I need to take a breather.`
      );
      msg.delete();
      setTimeout(() => newMessage.delete(), 2000);
    }
  }
});

function addCooldown(ID) {
  cooldownUsers.push(ID);
  setTimeout(
    () => _.pullAt(cooldownUsers, _.indexOf(cooldownUsers, ID)),
    cooldownTime
  );
}

client.login(process.env.CLIENT_TOKEN);
