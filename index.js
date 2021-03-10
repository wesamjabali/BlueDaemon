const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("./middleware/cors");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "40mb" }));
app.use(cors);
// Attach main router
const mainRouter = require("./routes");
app.use(mainRouter);

// Check
app.all("*", (req, res) => {
  res.status(404).json({});
});

const Discord = require("discord.js");
const client = new Discord.Client();
const wesamID = "539910274698969088";
const botlogChannel = "780910494692802610";
const prefix = ".";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("guildMemberAdd", (member) => {
  client.channels.fetch(botlogChannel).then((channel) => {
    channel.send(
      member.user.toString() +
        "```" +
        member.user.username +
        "#" +
        member.user.discriminator +
        " joined!```"
    );
  });
});

// Bot user commands
client.on("message", (msg) => {
  if (msg.content.startsWith(prefix)) {
    msg.content = msg.content.substring(1);

    // Responds with help message
    if (msg.content === "help" && !msg.author.bot) {
      msg.reply("```I'm in dev mode! Check back later for updates.```");
      client.channels.fetch(botlogChannel).then((channel) => {
        channel.send(
          "Hey <@" +
            wesamID +
            ">!\n" +
            msg.author.toString() +
            " pinged me in " +
            msg.channel.toString()
        );
      });
    }
  }
});

// client.on("messageDelete", (msg) => {
//     //   msg.channel.send("```" + msg.content + "```");
// });

client.login("ODE5MTAzMTE1NjkzMjYwODYw.YEhvOA.lXP1WAjk9w6Eu3O62jDj0_SIeZ4");
