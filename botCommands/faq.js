const Discord = require('discord.js');
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

    const faqCommandEmbed = new Discord.MessageEmbed()
      .setColor('#cc9543')
      .setTitle('Frequently Asked Questions')
      .setDescription(
        !users
          ? '**The definition of insanity is answering the same question over and over again when we have an <#823266307293839401>!  Help us stay sane by giving it a read.**'
          : `**The definition of insanity is answering the same question over and over again when we have an <#823266307293839401>!${users}, help us stay sane by giving it a read.**`,
      );

    return faqCommandEmbed;
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
