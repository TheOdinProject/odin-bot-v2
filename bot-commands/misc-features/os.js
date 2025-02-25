const Discord = require('discord.js');
const { registerBotCommand } = require('../../botEngine');
const { os } = require('../../lib/commandsContent');

const { color, title, description } = os;

const command = {
  regex: /(?<!\S)!os(?!\S)/,
  cb: () => {
    const osEmbed = new Discord.EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description);

    return { embeds: [osEmbed] };
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
