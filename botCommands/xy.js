const Discord = require('discord.js');
const { registerBotCommand } = require('../botEngine');

const command = {
  regex: /(?<!\S)!xy(?!\S)/,
  cb: () => {
    const xyEmbed = new Discord.EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('This could very well be an xy problem')
      .setDescription(`
What problem are you *really* trying to solve?
Check out [this article about xy problems](https://xyproblem.info/) to help others better understand your question.
    `);
    return { embeds: [xyEmbed] };
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;