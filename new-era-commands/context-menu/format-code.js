const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
} = require('discord.js');
const FormatCodeService = require('../../services/format-code');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('beta Format Code')
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction) => {
    await FormatCodeService.handleContextMenuInteraction(interaction);
  },
};
