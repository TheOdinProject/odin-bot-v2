const { EmbedBuilder } = require('discord.js');
const { registerBotCommand } = require('../botEngine');

const command = {
  regex: /\B!google\s+.+/,
  cb: ({ content }) => {
    const prompt = content.match(/\B!google\s+(.+)/)[1];
    const searchUrl = `https://www.google.com/search?q=${prompt.replaceAll(' ', '+')}`;
    const googleEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Search Google')
      .setDescription(`This [Google query for "${prompt}"](${searchUrl}) might help you find what you're looking for.`);
    return { embeds: [googleEmbed]};
  }
};
registerBotCommand(command.regex, command.cb);

module.exports = command;