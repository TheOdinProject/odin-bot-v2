const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { top } = require('../../commandsContent');

const { color, title, description } = top;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Information about The Odin Project')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const topEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description);

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [topEmbed],
    });
  },
};
