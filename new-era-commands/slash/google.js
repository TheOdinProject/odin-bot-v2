const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('google')
    .setDescription('Search Google')
    .addStringOption((option) => option
      .setName('prompt')
      .setDescription('term to search')
      .setRequired(true))
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;
    const prompt = interaction.options.getString('prompt');
    const searchUrl = `https://www.google.com/search?q=${prompt.replaceAll(' ', '+')}`;

    const googleEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Search Google')
      .setDescription(`This [Google query for "${prompt}"](${searchUrl}) might help you find what you're looking for.`);
    await interaction.reply({
      content: userId ? `<@${userId}>` : '',
      embeds: [googleEmbed],
    });
  },
};
