const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('searchmdn')
    .setDescription('Search for terms in MDN')
    .addStringOption((option) => option
      .setName('prompt')
      .setDescription('term to search')
      .setRequired(true))
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;
    const prompt = interaction.options.getString('prompt');
    const searchUrl = `https://developer.mozilla.org/en-US/search?q=${prompt.replaceAll(' ', '+')}`;

    const searchEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Search MDN')
      .setDescription(
        `Here are the [MDN results for "${prompt}"](${searchUrl})`,
      );
    await interaction.reply({
      content: userId ? `<@${userId}>` : '',
      embeds: [searchEmbed],
    });
  },
};
