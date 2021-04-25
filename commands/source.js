const config = require("../config.json");
const Discord = require("discord.js");
module.exports = {
  name: "cb",
  description: "Show code block help message",
  facultyOnly: false,
  privileged: false,
  usage: "cb",
  execute: async (msg, isModerator, isFaculty, client) => {
    const newMessage = "How to format code:\n\`\`\`java\npublic static void main(String[] args)\`\`\`Is done like this:\n\\`\\`\\`java\npublic static void main(String[] args)\\`\\`\\`";

    msg.channel.send(newMessage);
  },
};
