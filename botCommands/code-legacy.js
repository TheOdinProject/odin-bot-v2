const Discord = require("discord.js");
const { registerBotCommand } = require("../botEngine");
const { code } = require("../commandsContent")

const { color, title, description } = code;

const command = {
  regex: /(?<!\S)!code(?!\S)/,
  cb: ({ mentions }) => {
    let users = "";
    if (mentions.users) {
      mentions.users.forEach((user) => {
        users += `<@${user.id}> `;
      });
    }

    const codeCommandEmbed = new Discord.EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description);

    return {
      content: users ? `${users.trim()}` : '',
      embeds: [codeCommandEmbed]
    };
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
