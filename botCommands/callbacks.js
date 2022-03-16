const { registerBotCommand } = require('../botEngine.js');

const command = {
  regex: /(?<!\S)\?callbacks(?!\S)/,
  cb: () => '**DID SOMEONE SAY CALLBACKS?: https://briggs.dev/blog/understanding-callbacks**',
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
