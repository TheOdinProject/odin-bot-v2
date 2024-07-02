const Discord = require("discord.js");
const { registerBotCommand } = require("../botEngine");
const { os } = require("../lib/commandsContent");

const { color, title, description, url } = os;

const command = {
  regex: /(?<!\S)!os(?!\S)/,
  cb: () => {
    const osEmbed = new Discord.EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)
      .setURL(url);

    return { embeds: [osEmbed] };
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
