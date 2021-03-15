module.exports =
  /* Log to log channel */
  /* To use: 
    log(msg.guild, `MESSAGE`);
*/
  async function log(guild, message) {
    const logChannel = await guild.channels.cache.find(
      (c) => c.id == guild.config.log_channel
    );
    logChannel.send(message);
  };
