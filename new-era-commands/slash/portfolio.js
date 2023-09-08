const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('portfolio')
    .setDescription('Information about portfolio-worthy projects')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;

    const portfolioEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Strategically Building Your Portfolio')
      .setDescription(`
*"People tend to spend a lot of time on the first few projects expecting them to be portfolio pieces. The problem with this approach is that you will be building more impressive projects very soon after Foundations*"...

Read more on which projects are worth your extra time in
[this article about strategically building your portfolio](https://dev.to/theodinproject/strategically-building-your-portfolio-1km4)
`);
    await interaction.reply({
      content: userId ? `<@${userId}>` : '',
      embeds: [portfolioEmbed],
    });
  },
};
