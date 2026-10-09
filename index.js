const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { token, channels } = require('./config');
const MissingEnvVarError = require('./utils/errors/missing-env-var');
const DatabaseError = require('./utils/errors/database');
const DuplicateIdsError = require('./utils/errors/duplicate-ids');

const missingMandatoryEnvKeys = MissingEnvVarError.getMissingMandatoryKeys();
if (missingMandatoryEnvKeys.length) {
  throw new MissingEnvVarError(missingMandatoryEnvKeys);
}

const databaseErrorCode = DatabaseError.checkMigrations();
if (databaseErrorCode) {
  throw new DatabaseError(databaseErrorCode);
}

const duplicateKeys = DuplicateIdsError.getDuplicateIds(channels);
if (duplicateKeys.length) {
  throw new DuplicateIdsError(duplicateKeys);
}

const events = require('./events');
require('./bin/deploy-commands');

// PRIVILIGED INTENT ACCESS (MessageContent + GuildMembers) TEMPORARILY DISABLED AS STILL IN REVIEW SO OTHER FEATURES STILL WORK
// WILL BE RESTORED ONCE APPROVED
const client = new Client({
  intents: [
    // GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

for (const [name, event] of events) {
  if (event.once) {
    client.once(name, event.execute(client));
  } else {
    client.on(name, event.execute(client));
  }
}

client.login(token);
