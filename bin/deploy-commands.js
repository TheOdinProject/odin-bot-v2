// SCRIPT TO REGISTER THE NEW DISCORD COMMANDS
// Commands can be deployed directly from terminal with: node bin/deploy-commands.js

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId, token } = require('../config');
const commands = require('../new-era-commands');

const rest = new REST({ version: '10' }).setToken(token);

const commandsMetadata = Array.from(commands.values()).map((command) => command.data.toJSON());

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandsMetadata })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
