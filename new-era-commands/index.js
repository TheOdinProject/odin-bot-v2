const { glob } = require('glob');
const path = require('path');

const commandFiles = glob.sync('./new-era-commands/**/*.js', { ignore: './new-era-commands/*' });

const commands = new Map();

commandFiles.forEach((file) => {
  const filePath = path.resolve(file);
  /* eslint-disable global-require, import/no-dynamic-require */
  const command = require(filePath);
  commands.set(command.data.name, command);
});

module.exports = commands;
