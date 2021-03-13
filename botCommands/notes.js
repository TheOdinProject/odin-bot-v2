const { registerBotCommand } = require('../botEngine.js');

const command = {
  regex: /(?<!\S)\/notes(?!\S)/,
  cb: () => 'To note, or not to note, that is the question. Please read this: https://discord.com/channels/505093832157691914/505093832157691916/768161823366578176',
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
