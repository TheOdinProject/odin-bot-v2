const { globSync } = require('glob');
const path = require('path');

const commandFiles = globSync('./bot-commands/**/*.js', {
  ignore: ['bot-commands/*.js', 'bot-commands/**/*.test.js'],
});

const discordRegistrableCommands = new Map();
const manuallyRegistrableCommands = new Map();

commandFiles.forEach((file) => {
  const filePath = path.resolve(file);
  const command = require(filePath);

  if (command.data) {
    discordRegistrableCommands.set(command.data.name, command);
  }
  if (command.legacy || !command.data) {
    const commandToSet = command.legacy ?? command;
    manuallyRegistrableCommands.set(commandToSet.name, commandToSet);
  }
});

module.exports = { discordRegistrableCommands, manuallyRegistrableCommands };
