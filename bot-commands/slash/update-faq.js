const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const UpdateFAQsService = require('../../services/update-faq/update-faq.service');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('updatefaq')
    .setDescription('update FAQs in the #faq channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction) => {
    await UpdateFAQsService.handleInteraction(interaction);
  },
};
