const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { wsl } = require('../../commandsContent');

const { color, title, description } = wsl;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wsl')
    .setDescription('Help with using WSL')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;

    const wslEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)

    await interaction.reply({
      content: userId ? `<@${userId}>` : '',
      embeds: [wslEmbed],
    });
  },
};
