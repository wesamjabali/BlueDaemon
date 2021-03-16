module.exports =
  /* Log to log channel */
  /* To use: 
    log(msg.channel, `MESSAGE`);
*/
  async function log(channel, message) {
    const logChannel = await channel.guild.channels.cache.find(
      (c) => c.id == channel.config.log_channel
    );
    logChannel.send(message);
  };
