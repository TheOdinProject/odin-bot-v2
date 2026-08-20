const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { token, channels } = require('./config');
const RedisService = require('./services/redis');
const MissingEnvVarError = require('./utils/errors/missing-env-var');
const PendingMigrationsError = require('./utils/errors/pending-migrations');
const DuplicateIdsError = require('./utils/errors/duplicate-ids');

const missingMandatoryEnvKeys = MissingEnvVarError.getMissingMandatoryKeys();
if (missingMandatoryEnvKeys.length) {
  throw new MissingEnvVarError(missingMandatoryEnvKeys);
}

if (PendingMigrationsError.hasPendingMigrations()) {
  throw new PendingMigrationsError();
}

const duplicateKeys = DuplicateIdsError.getDuplicateIds(channels);
if (duplicateKeys.length) {
  throw new DuplicateIdsError(duplicateKeys);
}

RedisService.init();

// must deploy commands first to register what rotations need to be seeded)
require('./bin/deploy-commands');
require('./bin/seed-database');

const events = require('./events');

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
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
