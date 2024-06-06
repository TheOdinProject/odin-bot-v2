const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
} = require("discord.js");
const SpamBanningService = require("../../services/spam-ban/spam-banning.service");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Bann Spammer")
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction) => {
    await SpamBanningService.handleInteraction(interaction);
  },
};
