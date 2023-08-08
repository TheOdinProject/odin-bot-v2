const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../../config');

axios.default.defaults.headers.get.Authorization = `Token ${config.pointsbot.token}`;

class PointsService {
  static handleInteraction(interaction) {
    if (interaction.options.getSubcommand() === 'user') {
      PointsService.displayUserPoints(interaction);
    } else {
      PointsService.displayLeaderboard(interaction);
    }
  }

  static async displayUserPoints(interaction) {
    try {
      const user = interaction.options.getUser('name');
      const response = await axios.get(`https://www.theodinproject.com/api/points/${user.id}`);
      const userPoints = response.data.points !== undefined ? response.data.points : 0;
      const rank = response.data.rank !== undefined ? `${response.data.rank} - ` : '';

      const userRankReply = new EmbedBuilder()
        .setColor('#cc9543')
        .setTitle('Leaderboard')
        .addFields([{ name: 'User Rank', value: `${rank}${user.username} has ${userPoints} point${userPoints === 1 ? '' : 's'}!` }]);

      await interaction.reply({ embeds: [userRankReply] });
    } catch (err) {
      console.log(err.stack);
      console.log('@ new-era-commands/slash/leaderboard.js function displayUserRank()');
    }
  }

  static getUsersList(users, limit, offset, interaction) {
    let usersList = '';

    for (let i = offset; i < limit + offset; i += 1) {
      const user = users[i];
      const member = interaction.guild.members.cache.get(user.discord_id);
      const username = member ? member.displayName.replace(/!/g, '!') : 'Unknown';
      if (i === 0) {
        usersList += `${i + 1} - ${username} [${user.points} points] :tada: \n`;
      } else {
        usersList += `${i + 1} - ${username} [${user.points} points] \n`;
      }
    }

    return usersList;
  }

  static async displayLeaderboard(interaction) {
    try {
      const response = await axios.get('https://www.theodinproject.com/api/points');
      // eslint-disable-next-line max-len
      const users = response.data.filter((user) => interaction.guild.members.cache.get(user.discord_id));

      let limit = interaction.options.getInteger('limit');
      limit = limit <= 25 && limit > 0 ? limit : 25;
      limit = limit <= users.length ? limit : users.length;

      let offset = interaction.options.getInteger('offset');
      offset = offset > 0 ? offset : 0;
      // Always show the last members if offset too high
      offset = offset + limit < users.length ? offset : Math.max(0, users.length - limit);

      const usersList = PointsService.getUsersList(users, limit, offset, interaction);

      const leaderboardReply = new EmbedBuilder()
        .setColor('#cc9543')
        .setTitle('Leaderboard')
        .addFields([{ name: 'Server Ranking', value: usersList || 'Be the first to earn a point!' }]);

      await interaction.reply({ embeds: [leaderboardReply] });
    } catch (err) {
      console.log(err.stack);
      console.log('@ new-era-commands/slash/leaderboard.js function displayLeaderboardRanking()');
    }
  }
}

module.exports = PointsService;
