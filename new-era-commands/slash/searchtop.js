const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('searchtop')
    .setDescription('Search for text in The Odin Project website (with Google)')
    .addStringOption((option) => option.setName('prompt').setDescription('term to search').setRequired(true))
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;
    const prompt = interaction.options.getString('prompt');
    const searchUrl = `https://www.google.com/search?q=site:theodinproject.com+${prompt.replaceAll(' ', '+')}`;

    await interaction.reply(
      userId ? `<@${userId}>\nSearching The Odin Project for \`${prompt}\`: ${searchUrl}` : `Searching The Odin Project for \`${prompt}\`: ${searchUrl}`,
    );
  },
};
