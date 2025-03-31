const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('memory')
    .setDescription(
      "A professional's anecdote about why you don't need to memorize everything you're learning.",
    )
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');
    const memoryEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Memorization and learning to code')
      .setDescription(
        "Please read this [blog post about why you don't need to memorize everything you learn.](https://dev.to/theodinproject/memorization-and-learning-to-code-1b6h)",
      );
    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [memoryEmbed],
    });
  },
};
