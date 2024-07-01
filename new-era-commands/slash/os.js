const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { os } = require('../../commandsContent');

const { color, title, description } = os;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('os')
    .setDescription('Using other OS\'s')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;

    const osEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)

    await interaction.reply({
      content: userId ? `<@${userId}>` : '',
      embeds: [osEmbed],
    });
  },
};
