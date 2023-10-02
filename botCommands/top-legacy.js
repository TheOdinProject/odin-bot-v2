const Discord = require('discord.js');
const { registerBotCommand } = require('../botEngine');

const command = {
  regex: /(?<!\S)!top(?!\S)/,
  cb: () => {
    const topLegacyEmbed = new Discord.EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('The Odin Project').setDescription(`
For more information about The Odin Project, visit our site:
[Your Career in Web Development Starts Here](https://www.theodinproject.com/)    
    `);
    return { embeds: [topLegacyEmbed] };
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
