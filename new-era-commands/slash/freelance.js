const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('freelancing')
    .setDescription('Things to consider about freelancing'),
  execute: async (interaction) => {
    const freelanceEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Freelancing')
      .setDescription(`
Here are some things that should be considered before getting into freelancing: https://discord.com/channels/505093832157691914/505093832157691916/928760451213443193 
      `);

    await interaction.reply({ embeds: [freelanceEmbed] });
  },
};
