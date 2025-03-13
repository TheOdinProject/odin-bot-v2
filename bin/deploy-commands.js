// SCRIPT TO REGISTER THE NEW DISCORD COMMANDS
// This will be automatically run when the bot starts (required in index.js)
// This script can also be run directly from terminal with: node bin/deploy-commands.js

/* eslint import/no-unresolved: 2 */
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId, token } = require('../config');
const { registerBotCommand } = require('../events').get('messageCreate');
const {
  discordRegistrableCommands,
  manuallyRegistrableCommands,
} = require('../bot-commands');

// Registering non-slash commands like inline ! commands, points and party parrot
manuallyRegistrableCommands.forEach((command) => {
  registerBotCommand(command.regex, command.cb);
});

// Registering slash/context-menu commands
const rest = new REST({ version: '10' }).setToken(token);
const commandsMetadata = Array.from(discordRegistrableCommands.values()).map(
  (command) => command.data.toJSON(),
);
rest
  .put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commandsMetadata,
  })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
