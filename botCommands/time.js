const { registerBotCommand } = require('../botEngine.js');

const command = {
  regex: /(?<!\S)\/time(?!\S)/,
  cb: async ({ mentions }) => {
    let users = '';
    const mentionedUsers = Array.from(mentions.users.values());
    if (mentionedUsers.length >= 3) {
      mentionedUsers.forEach((user, index) => {
        if (index < mentionedUsers.length - 1) {
          users += ` ${user},`;
        } else {
          users += ` and ${user}`;
        }
      });
    } else if (mentionedUsers.length === 2) {
      mentionedUsers.forEach((user, index) => {
        if (index < mentionedUsers.length - 1) {
          users += ` ${user}`;
        } else {
          users += ` and ${user}`;
        }
      });
    } else if (mentionedUsers.length === 1) {
      users = `, ${mentionedUsers[0]}`;
    }
    return !users ? 'Time is an illusion. Please read this: https://discord.com/channels/505093832157691914/505093832157691916/765633002393829389' : `Time is an illusion${users}. Please read this: https://discord.com/channels/505093832157691914/505093832157691916/765633002393829389`;
  },
};
registerBotCommand(command.regex, command.cb);

module.exports = command;
