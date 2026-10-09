const { SlashCommandBuilder } = require('discord.js');
const PointsService = require('../../services/points');

const data = new SlashCommandBuilder()
  .setName('thanks')
  .setDescription('Give a point to people who helped you');

PointsService.USER_OPTION_NAMES.forEach((name, i) => {
  data.addUserOption((option) =>
    option
      .setName(name)
      .setDescription('Who to thank')
      .setRequired(i === 0),
  );
});

module.exports = {
  data,
  execute: async (interaction) => {
    await PointsService.awardPoints(interaction);
  },
};
