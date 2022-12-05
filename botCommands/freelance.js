const { registerBotCommand } = require('../botEngine.js');

const command = {
  regex: /(?<!\S)!freelance(?!\S)/,
  cb: () => 'Here are some things that should be considered before getting into freelancing: https://discord.com/channels/505093832157691914/505093832157691916/928760451213443193 ',
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
