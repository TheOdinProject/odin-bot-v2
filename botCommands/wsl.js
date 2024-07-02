const Discord = require("discord.js");
const { registerBotCommand } = require("../botEngine");
const { wsl } = require("../lib/commandsContent");

const { color, title, description } = wsl;

const command = {
  regex: /(?<!\S)!wsl(?!\S)/,
  cb: () => {
    const wslEmbed = new Discord.EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description);

    return { embeds: [wslEmbed] };
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
