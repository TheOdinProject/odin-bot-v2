const { registerBotCommand } = require('../botEngine');

const command = {
  regex: /(?<!\S)!memory(?!\S)/,
  cb: () => 'How important is memorization on your coding journey? Read a real-life case here: https://dev.to/theodinproject/memorization-and-learning-to-code-1b6h',
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
