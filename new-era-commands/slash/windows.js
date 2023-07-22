const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('windows')
    .setDescription('Windows'),
  execute: async (interaction) => {
    const windowsEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Windows')
      .setDescription('**The Odin Project does not support Windows, or any OS outside of our recommendations**. We are happy to assist with any questions about installing a VM, using WSL, or dual booting Linux. <https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/installation-overview#os-options>')
      .setURL('https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/installation-overview#os-options');

    await interaction.reply({ embeds: [windowsEmbed] });
  },
};
