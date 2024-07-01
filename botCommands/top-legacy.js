const Discord = require('discord.js');
const { registerBotCommand } = require('../botEngine');
const { top } = require('../commandsContent');

const { color, title, description } = top;

const command = {
  regex: /(?<!\S)!top(?!\S)/,
  cb: () => {
    const topLegacyEmbed = new Discord.EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description);

    return { embeds: [topLegacyEmbed] };
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
