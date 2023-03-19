const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits } = require('discord.js');
const ModerationMessageDeleteService = require('../../services/moderation-message-delete.service');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Delete Message')
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction) => {
    await ModerationMessageDeleteService.handleInteraction(interaction);
  },
};
