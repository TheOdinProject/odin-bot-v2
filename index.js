const { Client, GatewayIntentBits, Partials } = require('discord.js');

const { globSync } = require('glob');
const path = require('path');
const { token, channels } = require('./config');
const events = require('./events');
const MissingEnvVarError = require('./utils/errors/missing-env-var');
const DuplicateIdsError = require('./utils/errors/duplicate-ids');

// check all mandatory env variables are set
const missingMandatoryEnvKeys = [
  'DISCORD_API_KEY',
  'DISCORD_CLIENT_ID',
  'DISCORD_GUILD_ID',
].filter((key) => !process.env[key]);
if (missingMandatoryEnvKeys.length) {
  throw new MissingEnvVarError(missingMandatoryEnvKeys);
}

// check all channel IDs are unique
const duplicateKeys = DuplicateIdsError.checkForDuplicateIds(channels);
if (duplicateKeys.length) {
  throw new DuplicateIdsError(duplicateKeys);
}

require('./bin/deploy-commands');

// Register points/party parrot features
globSync('./bot-commands/{points,party-parrot}/*.js', {
  ignore: 'bot-commands/**/*.test.js',
}).forEach((file) => {
  require(`${path.resolve(file)}`); // eslint-disable-line global-require, import/no-dynamic-require
});

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
  ], // eslint-disable-line max-len
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// eslint-disable-next-line no-restricted-syntax
for (const [name, event] of events) {
  if (event.once) {
    client.once(name, event.execute(client));
  } else {
    client.on(name, event.execute(client));
  }
}

client.login(token);
