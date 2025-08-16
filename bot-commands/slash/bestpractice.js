const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bestpractice')
    .setDescription(
      "You don't need to follow the best practices when you are new to coding",
    )
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');
    const bestpracticeEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle("Pursuing Best Practices is a bad practice (When You're New) ")
      .setDescription(
        "Please read this [blog post about why you don't need to follow the best practices when you are new to coding](https://dev.to/theodinproject/pursuing-best-practices-is-a-bad-practice-when-youre-new-37pb)",
      );
    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [bestpracticeEmbed],
    });
  },
};
