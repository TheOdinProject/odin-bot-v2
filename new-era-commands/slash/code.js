const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('code')
    .setDescription('How to share your code')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;

    const codeEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('How to share your code')
      .setDescription(`
**Codeblocks:**

To write multiple lines of code with language syntax highlighting, use three [backticks](https://i.stack.imgur.com/ETTnT.jpg) followed by the language:

\\\`\\\`\\\`js
// your JavaScript code goes here
\\\`\\\`\\\`

**Inline code:**

For \`inline code\` use one backtick (no syntax highlighting):

\\\`code here!\\\`

**Websites:**

- [Code Sandbox](https://codesandbox.io/) for Webpack/React projects
- [Repl.it](https://replit.com/) for JavaScript/Ruby projects
- [Codepen](https://codepen.io/) for basic HTML/CSS/Javascript
      `);

    await interaction.reply({
      content: userId ? `<@${userId}>` : '',
      embeds: [codeEmbed],
    });
  },
};
