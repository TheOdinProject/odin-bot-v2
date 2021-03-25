const { registerBotCommand } = require('../botEngine.js');

const command = {
  regex: /(?<!\S)\/faq(?!\S)/,
  cb: async ({ mentions }) => {
    let users = '';
    const mentionedUsers = mentions.users.array();
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
      users = ` ${mentionedUsers[0]}`;
    }
<<<<<<< HEAD
    return !users ? '**The definition of insanity is answering the same question over and over again when we have an FAQ!  Help us stay sane by giving this a read: <https://discord.com/channels/505093832157691914/823266307293839401/823266549912829992>**' : `**The definition of insanity is answering the same question over and over again when we have an FAQ! ${users}, help us stay sane by giving this a read: <https://discord.com/channels/505093832157691914/823266307293839401/823266549912829992>**`;
=======
    return !users ? '**The definition of insanity is answering the same question over and over again when we have an FAQ!  Help us stay sane by giving this a read: https://discord.com/channels/505093832157691914/823266307293839401/823266549912829992**' : `${users} **The definition of insanity is answering the same question over and over again when we have an FAQ!  Help us stay sane by giving this a read: <https://discord.com/channels/505093832157691914/823266307293839401/823266549912829992>**`;
>>>>>>> 881a45b07ffd291507ac2b44a170d2c3f799adfe
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
