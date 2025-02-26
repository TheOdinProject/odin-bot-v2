const { globSync } = require('glob');
const path = require('path');

const commandFiles = globSync('./bot-commands/**/*.js', {
  ignore: [
    'bot-commands/*.js',
    // If not ignored, registerBotCommand call will result in circular dep
    // points/party parrot get registered in /index.js
    'bot-commands/{points,party-parrot}/*.js',
    'bot-commands/**/*.test.js',
  ],
});

const commands = new Map();

commandFiles.forEach((file) => {
  const filePath = path.resolve(file);
  /* eslint-disable global-require, import/no-dynamic-require */
  const command = require(filePath);
  commands.set(command.data.name, command);
});

module.exports = commands;
