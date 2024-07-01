const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { code } = require('../../commandsContent');

const { color, title, description } = code;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('code')
    .setDescription('How to share your code')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const codeEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description);

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [codeEmbed],
    });
  },
};
