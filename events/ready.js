const { Events } = require('discord.js');
const { guildId } = require('../config');
const RedisService = require('../services/redis');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute: () => async (client) => {
    console.log('Bot session started:', new Date());

    RedisService.init();

    // Fetch Guild members on startup to ensure the integrity of the cache
    const guild = await client.guilds.fetch(guildId);
    await guild.members.fetch();
  },
};
