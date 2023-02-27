const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('code')
    .setDescription('Help with embedding code')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;
    const codeEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('HOW TO EMBED CODE SNIPPETS')
      .setDescription(
        !userId
          ? "Hey, here's some helpful tips on sharing your code with others!"
          : `Hey, <@${userId}>, here's some helpful tips on sharing your code with others!`,
      )
      // weird formating is needer to avoid identation on mobile
      .addFields([
        {
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
    await interaction.reply({ embeds: [codeEmbed] });
  },
};
