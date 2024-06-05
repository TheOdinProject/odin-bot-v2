const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
} = require("discord.js");
const SpammerBanning = require("../../services/spammer-banning.service");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Bann Spammer")
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction) => {
    await SpammerBanning.handleInteraction(interaction);
  },
};
