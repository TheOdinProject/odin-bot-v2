const { globSync } = require('glob');
const path = require('path');

const eventFiles = globSync('./events/**/*.js', {
  ignore: 'events/index.js',
});

const events = new Map();

eventFiles.forEach((file) => {
  const filePath = path.resolve(file);
  /* eslint-disable global-require, import/no-dynamic-require */
  const event = require(filePath);
  events.set(event.name, event);
});

module.exports = events;
