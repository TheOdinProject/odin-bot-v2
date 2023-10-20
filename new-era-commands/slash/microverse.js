const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('microverse')
    .setDescription('Information about Microverse using The Odin Project\'s content without permission')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');
    const mvEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('TOP is not affiliated with Microverse')
      .setDescription(`
Microverse is using The Odin Project's licensed content without permission. Please read [this statement we have made about that on Discord](https://discord.com/channels/505093832157691914/505093832157691916/781170792095809547)
      `);
    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [mvEmbed],
    });
  },
};
