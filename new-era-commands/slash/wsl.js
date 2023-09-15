const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wsl')
    .setDescription('Help with using WSL')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;

    const wslEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('WSL')
      .setDescription('For help with using WSL please use the WSL channel: <#1077759838785904640>')

    await interaction.reply({
      content: userId ? `<@${userId}>` : '',
      embeds: [wslEmbed],
    });
  },
};
