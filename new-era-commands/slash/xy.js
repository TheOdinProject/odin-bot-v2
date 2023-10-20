const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xy')
    .setDescription('xy problem article')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const xyEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('This could very well be an xy problem')
      .setDescription(`
What problem are you *really* trying to solve?
Check out [this article about xy problems](https://xyproblem.info/) to help others better understand your question.
    `);

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [xyEmbed],
    });
  },
};
