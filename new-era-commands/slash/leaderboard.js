const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../../config');

axios.default.defaults.headers.get.Authorization = `Token ${config.pointsbot.token}`;

function getLeaderboardInformation(interaction) {
  if (interaction.options.getSubcommand() === 'user') {
    displayUserRank(interaction);
  }
}

async function displayUserRank(interaction) {
  const user = interaction.options.getUser('name');

  try {
    const response = await axios.get(`https://www.theodinproject.com/api/points/${user.id}`);
    const userPoints = response.data.points !== undefined ? response.data.points : 0;
    const rank = response.data.rank !== undefined ? `${response.data.rank} - ` : '';
    interaction.reply(`${rank}${user.username} has ${userPoints} point${userPoints === 1 ? '' : 's'}!`);
  } catch (err) {
    console.log(err);
  }
}

function userRanking(command) {
  command.setName('user')
    .setDescription('User Ranking')
    .addUserOption((option) => {
      option.setName('name')
        .setDescription("Display user's rank in the leaderboard")
        .setRequired(true);
      return option;
    });

  return command;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Placehodler')
    .addSubcommand(userRanking),
  execute: getLeaderboardInformation,
};
