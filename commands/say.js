module.exports = {
  name: "say",
  description: "Make me say something",
  facultyOnly: false,
  privileged: true,
  usage: "say <message>",
  execute: async (msg, isModerator, isFaculty, client) => {
    const say = msg.content.substring(module.exports.name.length + 1);
    await msg.channel.send(say);
    msg.delete();
  },
};
