module.exports = {
  name: "say",
  description: "Make me say something",
  facultyOnly: false,
  privileged: true,
  usage: "say <message>",
  execute: async (msg, isModerator, isFaculty, client) => {
    await msg.channel.send(msg.content.split("say ")[1]);
    msg.delete();
  },
};