const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const UpdateRulesService = require("../../services/update-rules/update-rules.service");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("updaterules")
    .setDescription("update rules in the #rules channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction) => {
    await UpdateRulesService.handleInteraction(interaction);
  },
};
