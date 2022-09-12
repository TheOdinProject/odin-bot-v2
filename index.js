const { Client, GatewayIntentBits, Partials } = require('discord.js');

const glob = require('glob');
const path = require('path');
const { listenToMessages, listenToReactions } = require('./botEngine.js');
require('dotenv').config();

glob.sync('./botCommands/**/*.js', { ignore: './botCommands/**/*.test.js' }).forEach((file) => {
  require(`${path.resolve(file)}`); // eslint-disable-line global-require, import/no-dynamic-require
});

const client = new Client({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions], // eslint-disable-line max-len
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once('ready', async () => {
  console.log('Bot session started:', new Date());

  // Fetch Guild members on startup to ensure the integrity of the cache
  const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
  await guild.members.fetch();
});

listenToMessages(client);
listenToReactions(client);

client.login(process.env.DISCORD_API_KEY);
