const { registerBotCommand } = require('../botEngine.js');

const command = {
  regex: /(?<!\S)\/top(?!\S)/,
  cb: () =>
    'The Odin Project. Your Career in Web Development Starts Here. <https://www.theodinproject.com> ',
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
