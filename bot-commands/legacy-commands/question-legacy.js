const Discord = require('discord.js');
const { registerBotCommand } = require('../../botEngine');
const commandsContent = require('../../lib/commandsContent');

const { color, title, description } = commandsContent.question;

const question = {
  regex: /(?<!\S)!question(?!\S)/,
  cb: () => {
    const questionEmbed = new Discord.EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description);

    return { embeds: [questionEmbed] };
  },
};
registerBotCommand(question.regex, question.cb);

module.exports = question;
