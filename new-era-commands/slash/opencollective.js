const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const OpenCollectiveService = require('../../services/opencollective');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('opencollective')
    .setDescription('Provide your open collective username to get exclusive role')
    .addStringOption((option) => option
      .setName('username')
      .setDescription('Your open collective username')
      .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction) => {
    try {
      await OpenCollectiveService.handleInteraction(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'Something went wrong. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
