const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const PointsService = require('../../services/points');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('greatquestion')
    .setDescription('Give double points for a great question')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Who asked the great question')
        .setRequired(true),
    ),
  execute: async (interaction) => {
    await PointsService.awardFromInteraction(interaction, { points: 2 });
  },
};
