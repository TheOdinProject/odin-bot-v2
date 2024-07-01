const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { question } = require('../../commandsContent');

const { color, title, description } = question;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('question')
    .setDescription('Asking Great Questions')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const questionEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description);

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [questionEmbed],
     });
  },
};
