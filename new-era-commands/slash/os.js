const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('os')
    .setDescription('Using other OS\'s')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;

    const osEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Windows')
      .setDescription(
        `**The Odin Project does not support Windows or any other OS outside of our recommendations**. We are happy to assist with any questions about installing a VM, using WSL, or dual booting Linux.

        For more info on Windows, check out this exhaustive list on '[Why we do not support Windows](<https://github.com/TheOdinProject/blog/wiki/Why-We-Do-Not-Support-Windows>)'.

        <https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/installation-overview#os-options>
        `
      )
      .setURL('https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/installation-overview#os-options');

    await interaction.reply({
      content: userId ? `<@${userId}>` : '',
      embeds: [osEmbed],
    });
  },
};
