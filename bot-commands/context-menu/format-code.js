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
    try {
      await FormatCodeService.handleContextMenuInteraction(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  },
};
