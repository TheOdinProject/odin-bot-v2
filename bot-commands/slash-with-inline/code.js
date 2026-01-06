const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { color } = require('../../config');

const codeEmbed = new EmbedBuilder()
  .setColor(color)
  .setTitle('How to share your code').setDescription(`
**Codeblocks:**

To write multiple lines of code with language syntax highlighting, use three [backticks](https://i.stack.imgur.com/ETTnT.jpg) followed by the language:

\\\`\\\`\\\`js
// your JavaScript code goes here
\\\`\\\`\\\`

**Inline code:**

For \`inline code\` use one backtick (no syntax highlighting):

\\\`code here!\\\`

**Websites:**

- [Codepen](https://codepen.io/) for basic HTML/CSS/Javascript
- [Github](https://github.com) a link to an up-to-date GitHub repo
- [Repl.it](https://replit.com/) for JavaScript/Ruby projects
- [Code Sandbox](https://codesandbox.io/) for Webpack/React projects
`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('code')
    .setDescription('How to share your code')
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [codeEmbed],
    });
  },
  legacy: {
    name: 'code',
    regex: /(?<!\S)!code(?!\S)/,
    cb: () => ({ embeds: [codeEmbed] }),
  },
};
