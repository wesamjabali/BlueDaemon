module.exports = {
  name: "cb",
  description: "Show code block help message",
  facultyOnly: false,
  privileged: false,
  usage: "cb",
  execute: async (msg, isModerator, isFaculty, client) => {
    const newMessage = "To format your code for better readability, like this:\n```java\npublic static void main(String[] args)```\nYou should use the following format:\n\`\`\`java\npublic static void main(String[] args)\`\`\`";

    msg.channel.send(newMessage);
  },
};
