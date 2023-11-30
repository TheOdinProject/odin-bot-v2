const Discord = require("discord.js");
const { registerBotCommand } = require("../botEngine");

const command = {
  regex: /(?<!\S)!wsl(?!\S)/,
  cb: () => {
    const wslEmbed = new Discord.EmbedBuilder()
      .setColor("#cc9543")
      .setTitle("WSL")
      .setDescription(
        "For help with using WSL please use the WSL channel: <#1179839248803844117>"
      );

    return { embeds: [wslEmbed] };
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
