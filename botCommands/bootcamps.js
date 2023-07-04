const { registerBotCommand } = require('../botEngine');

const command = {
  regex: /(?<!\S)!bootcamps?(?!\S)/,
  cb: () => 'Friends don\'t let friends commit to bootcamps without being informed.  https://web.archive.org/web/20220410160426/https://twitter.com/lzsthw/status/1212284566431576069',
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
