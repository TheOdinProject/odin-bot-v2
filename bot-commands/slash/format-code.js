const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const FormatCodeService = require('../../services/format-code');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('formatcode')
    .setDescription("Info on bot's formatting code feature.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction) => {
    await FormatCodeService.handleSlashCommandInteraction(interaction);
  },
};
