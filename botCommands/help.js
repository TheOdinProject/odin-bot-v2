const Discord = require('discord.js');
const { registerBotCommand } = require('../botEngine.js');

const help = {
  regex: /(?<!\S)!help(?!\S)/,
  cb: () => {
    const helpEmbed = new Discord.EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Help')
      .setDescription('**By posting in this chatroom you agree to our [code of conduct](https://github.com/TheOdinProject/theodinproject/blob/master/doc/code_of_conduct.md).**')
      .addFields([
        {
          name: 'Add Points',
          value: 'Give points to someone who has been helpful by mentioning their name \n and adding ++ : \n `@username ++` or by \n giving them a star : `@username :star:`.',
          inline: true,
        },
        {
          name: 'Leaderboard',
          value: 'View the points leaderboard with `!leaderboard`. \n\n Modify it with `n=` and `start=` i.e. `!leaderboard n=25 start=30`.',
          inline: true,
        },
        {
          name: 'Contribute to the bot',
          value: '<https://github.com/TheOdinProject/odin-bot-v2>',
          inline: true,
        },
      ]);

    return { embeds: [helpEmbed] };
  },
};

const code = {
  regex: /(?<!\S)!code(?!\S)/,
  cb: ({ mentions }) => {
    let users = '';
    if (mentions.users) {
      mentions.users.forEach((user) => {
        users += `<@${user.id}> `;
      });
    }

    const codeCommandEmbed = new Discord.EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('HOW TO EMBED CODE SNIPPETS')
      .setDescription(
        !users ? 'Hey, here\'s some helpful tips on sharing your code with others!' : `Hey, ${users.trim()}, here's some helpful tips on sharing your code with others!`,
      )
      // weird formating is needer to avoid identation on mobile
      .addFields([{
        name: 'Sharing Code on Discord',
        value: `To write multiple lines of code with language syntax highlighting, use three backticks (<https://i.stack.imgur.com/ETTnT.jpg>), followed by the language.

\\\`\\\`\\\`js
[Put your JavaScript Code here!]
\\\`\\\`\\\`

For \`inline code\` use one backtick (no syntax highlighting):

\\\`Code here!\\\`
      `,
      },
      {
        name: 'Link a Code Sandbox to share Webpack/React examples',
        value: 'https://codesandbox.io/',
        inline: true,
      },
      {
        name: 'Link a Repl.it to share Javascript/Ruby examples',
        value: 'https://replit.com/',
        inline: true,
      },

      {
        name: 'Link a Codepen to share basic HTML/CSS/Javascript examples',
        value: 'https://codepen.io/',
        inline: true,
      },
      ]);

    return { embeds: [codeCommandEmbed] };
  },
};

registerBotCommand(help.regex, help.cb);
registerBotCommand(code.regex, code.cb);

module.exports = {
  help,
  code,
};
