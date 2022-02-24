const { Client, Intents } = require('discord.js');

const glob = require('glob');
const path = require('path');
const { listenToMessages } = require('./botEngine.js');
require('dotenv').config();

glob.sync('./botCommands/**/*.js', { ignore: './botCommands/**/*.test.js' }).forEach((file) => {
  require(`${path.resolve(file)}`); // eslint-disable-line global-require, import/no-dynamic-require
});

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
  console.log('Bot session started:', new Date());
});

listenToMessages(client);

client.login(process.env.DISCORD_API_KEY);
