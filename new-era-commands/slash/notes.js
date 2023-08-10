const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('notes')
    .setDescription('Things to consider about taking notes'),
  execute: async (interaction) => {
    const freelanceEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('To note, or not to note, that is the question')
      .setDescription(`
Please read this [discord message about what we think you should consider about taking notes](https://discord.com/channels/505093832157691914/505093832157691916/768161823366578176)
      `);

    await interaction.reply({ embeds: [freelanceEmbed] });
  },
};
