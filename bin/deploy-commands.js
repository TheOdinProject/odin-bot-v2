// SCRIPT TO REGISTER THE NEW DISCORD COMMANDS
// This will be automatically run when the bot starts (required in index.js)
// This script can also be run directly from terminal with: node bin/deploy-commands.js

/* eslint import/no-unresolved: 2 */
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId, token } = require('../config');
const { registerBotCommand } = require('../events').get('messageCreate');
const commands = Array.from(require('../bot-commands').values());

// Registering non-slash commands like inline ! commands, points and party parrot
commands.forEach((command) => {
  if (!command.isManuallyRegistrable && !command.legacy) {
    return;
  }

  const { regex, cb } = command.legacy ?? command;
  registerBotCommand(regex, cb);
});

// Registering slash/context-menu commands
const rest = new REST({ version: '10' }).setToken(token);
const commandsMetadata = commands
  .map((command) => command.data.toJSON?.())
  .filter(Boolean); // We don't want to include non-slash commands like points or party parrot
rest
  .put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commandsMetadata,
  })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
