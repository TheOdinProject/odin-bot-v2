const { EmbedBuilder } = require('discord.js');
const { registerBotCommand } = require('../botEngine');

const command = {
  regex: /\B!searchtop\s+.+/,
  cb: ({ content }) => {
    const prompt = content.match(/\B!searchtop\s+(.+)/)[1];
    const searchUrl = `https://www.google.com/search?q=site:theodinproject.com+${prompt.replaceAll(' ', '+')}}`;
    const topEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Search TOP')
      .setDescription(`Here are the [Google results for TOP lessons containing "${prompt}"](${searchUrl})`);
    return { embeds: [topEmbed]};
  }
};
registerBotCommand(command.regex, command.cb);

module.exports = command;