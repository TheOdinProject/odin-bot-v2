const events = require('./events');

module.exports = {
  // registerBotCommand is important to setup text commands in ./botCommands/.
  // I'm not messing with this export until
  // we have a better way of setting up our text based commands.
  registerBotCommand: events.get('messageCreate').registerBotCommand,
};
