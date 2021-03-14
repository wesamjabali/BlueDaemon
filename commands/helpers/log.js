const config = require("../../config.json")

module.exports =
  // Remove a role and password from the DB.
  async function log(client, message) {
    const logChannel = await client.channels.fetch(config.logChannelID)
    logChannel.send(message)
  };
