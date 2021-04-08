const Discord = require('discord.js');
const { registerBotCommand } = require('../botEngine.js');

const help = {
  regex: /(?<!\S)\/help(?!\S)/,
  cb: () => {
    const helpEmbed = new Discord.MessageEmbed()
      .setColor('#cc9543')
      .setTitle('Help')
      .setDescription('**By posting in this chatroom you agree to our [code of conduct](https://github.com/TheOdinProject/theodinproject/blob/master/doc/code_of_conduct.md).**')
      .addField(
        'Add Points',
        'Give points to someone who has been helpful by mentioning their name \n and adding ++ : \n `@username ++` or by \n giving them a star : `@username :star:`.',
        true,
      )
      .addField(
        'Leaderboard',
        'View the points leaderboard with `/leaderboard`. \n\n Modify it with `n=` and `start=` i.e. `/leaderboard n=25 start=30`.',
        true,
      )
      .addField(
        'Contribute to the bot',
        '<https://github.com/TheOdinProject/odin-bot-v2>',
        true,
      );

    return helpEmbed;
  },
};

const code = {
  regex: /(?<!\S)\/code(?!\S)/,
  cb: ({ mentions }) => {
    let users = '';
    if (mentions.users) {
      mentions.users.forEach((user) => {
        users += `<@${user.id}> `;
      });
    }

    const codeCommandEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('HOW TO EMBED CODE SNIPPETS')
      .setDescription(
        !users ? 'Hey, here\'s some helpful tips on sharing your code with others!' : `Hey, ${users.trim()}, here's some helpful tips on sharing your code with others!`,
      )
      .addField(
        'Sharing Code on Discord',
        `To write multiple lines of code with language syntax highlighting, use three backticks (<https://i.stack.imgur.com/ETTnT.jpg>), followed by the language.
      
      \\\`\\\`\\\`js
      [Put your JavaScript Code here!]
      \\\`\\\`\\\`

      For \`inline code\` use one backtick (no syntax highlighting):

      \\\`Code here!\\\`
      `,
      )
      .addField(
        'Link a Code Sandbox to share Webpack/React examples',
        'https://codesandbox.io/',
        true,
      )
      .addField(
        'Link a Repl.it to share Javascript/Ruby examples',
        'https://replit.com/',
        true,
      )
      .addField(
        'Link a Codepen to share basic HTML/CSS/Javascript examples',
        'https://codepen.io/',
        true,
      );

    return codeCommandEmbed;
  },
};

registerBotCommand(help.regex, help.cb);
registerBotCommand(code.regex, code.cb);

module.exports = {
  help,
  code,
};
