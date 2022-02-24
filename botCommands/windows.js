const Discord = require('discord.js');
const { registerBotCommand } = require('../botEngine.js');

const command = {
  regex: /(?<!\S)\/windows(?!\S)/,
  cb: () => {
    const windowsEmbed = new Discord.MessageEmbed()
      .setColor('#cc9543')
      .setTitle('Windows')
      .setDescription('**The Odin Project does not support Windows, WSL, or any OS outside of our recommendations**. We are happy to assist with any questions about installing a VM or dual booting Linux. <https://www.theodinproject.com/courses/foundations/lessons/installation-overview#os-options>')
      .setURL('https://www.theodinproject.com/courses/foundations/lessons/installation-overview#os-options');

    return { embeds: [windowsEmbed] };
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
