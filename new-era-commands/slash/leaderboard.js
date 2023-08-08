const SlashCommandBuilder = require('discord.js');
const PointsService = require('../../services/points/points.service');

function userPoints(command) {
  command.setName('user')
    .setDescription('User Leaderboard Rank')
    .addUserOption((option) => {
      option.setName('name')
        .setDescription("Display user's rank in the leaderboard")
        .setRequired(true);
      return option;
    });

  return command;
}

function leaderboard(command) {
  command.setName('leaderboard')
    .setDescription('Server Leaderboard Ranking')
    .addIntegerOption((option) => {
      option.setName('limit')
        .setDescription('Limit the result. Max is 25')
        .setRequired(false);
      return option;
    })
    .addIntegerOption((option) => {
      option.setName('offset')
        .setDescription('Offset is the starting position in the ranking')
        .setRequired(false);
      return option;
    });

  return command;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Leaderboard Ranking provides a fun way for users to see the points ranking on the server!')
    .addSubcommand(userPoints)
    .addSubcommand(leaderboard),
  execute: PointsService.handleInteraction,
};
