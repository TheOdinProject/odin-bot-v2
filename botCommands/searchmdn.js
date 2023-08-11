const Discord = require('discord.js');
const { registerBotCommand } = require('../botEngine');

const searchmdn = {
  regex: /\B!mdn\s+.+/,
  cb: ({ content }) => {
    const query = content.match(/\B!mdn\s+(.+)/)[1];
    const searchURL = `https://developer.mozilla.org/en-US/search?q=${query.split(' ').map(encodeURIComponent).join('+')}`;
    const searchmdnEmbed = new Discord.EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Search MDN')
      .setDescription(
        `Here are the [MDN results for "${query}"](${searchURL})`,
      );

    return { embeds: [searchmdnEmbed] };
  },
};
registerBotCommand(searchmdn.regex, searchmdn.cb);
