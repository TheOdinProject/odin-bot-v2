const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits } = require('discord.js');
const BanSpammer = require('../../services/ban-spammer.service');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Bann Spammer')
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction) => {
    await ModerationMessageDeleteService.handleInteraction(interaction);
  },
};
