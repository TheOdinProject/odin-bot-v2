const express = require('express');
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

    /**
     * server to listen for open collective webhook
     * incomplete implementation; just testing what the webhook looks like
     */
    const app = express()
    const port = process.env.PORT;
    app.use(express.json());
    app.post(`/oc/${process.env.OC_WEBHOOK_URL_SECRET}`, (req,res) => {
      const spamChannel = client.channels.cache.get('692909559442047098');
      spamChannel.send(`
\`\`\`json
${JSON.stringify(req.body)}
\`\`\`
      `)
      res.end();
    })
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  },
};
