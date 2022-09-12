const Discord = require('discord.js');
const { registerBotCommand } = require('../botEngine.js');

const command = {
  regex: /(?<!\S)!debug(?!\S)/,
  cb: () => {
    const template = new Discord.EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('DEBUGGING')
      .setURL('https://en.wikipedia.org/wiki/Debugging')
      .setDescription(
        'Based on the description of your problem, you can get to the root of it using a debugger. Learning how to track down problems like this is an inevitable part of being a developer.',
      )
      .addFields(
        [{
          name: 'Javascript',
          value: 'https://developers.google.com/web/tools/chrome-devtools/javascript',
        },
        {
          name: 'Ruby',
          value: 'https://www.theodinproject.com/lessons/ruby-debugging#debugging-with-pry-byebug',
        },
        ],
      );

    return { embeds: [template] };
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
