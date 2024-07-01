const Discord = require('discord.js');
const { registerBotCommand } = require('../botEngine');
const { xy } = require('../commandsContent');

const {color, title, description} = xy;
const command = {
  regex: /(?<!\S)!xy(?!\S)/,
  cb: () => {
    const xyEmbed = new Discord.EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description);
    return { embeds: [xyEmbed] };
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
