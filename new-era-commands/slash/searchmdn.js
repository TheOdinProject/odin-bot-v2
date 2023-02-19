const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('searchmdn')
    .setDescription('Search for text in MDN (with Google)')
    .addStringOption((option) => option.setName('prompt').setDescription('term to search').setRequired(true))
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;
    const prompt = interaction.options.getString('prompt');
    const searchUrl = `https://www.google.com/search?q=site:developer.mozilla.org+${prompt.replaceAll(' ', '+')}`;

    await interaction.reply(
      userId ? `<@${userId}>\nSearching MDN for \`${prompt}\`: ${searchUrl}` : `Searching MDN for \`${prompt}\`: ${searchUrl}`,
    );
  },
};
