const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../../config');

axios.default.defaults.headers.get.Authorization = `Token ${config.pointsbot.token}`;

class PointsService {
  static API_URL = 'https://www.theodinproject.com/api/points';

  static async handleInteraction(interaction) {
    if (interaction.options.getSubcommand() === 'user') {
      PointsService.displayUserPoints(interaction);
    } else if (interaction.options.getSubcommand() === 'leaderboard') {
      PointsService.displayLeaderboard(interaction);
    } else {
      PointsService.displayInfo(interaction);
    }
  }

  static async displayInfo(interaction) {
    const pointsEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Points in the TOP Discord server')
      .setDescription(`
Want to give credit where it's due? Show your appreciation for helpful members in our server by giving them a point! Mention their \`@name\` and add \`++\` or \`:star:\`

**Example:**

\`@username ++\`
\`@username :star:\`

**Club 40:**

Users who have accumulated 40 points will be awarded a special role in recognition of their consistent helpfulness.
For further details about our roles, please refer to [our discord #roles channel](https://discord.com/channels/505093832157691914/936424264180060200)

**Point Inflation:**

Please don't beg for points or abuse the point system.
We will have a strict moderation policy in place which will include losing access to the bot or participation in the points system.

Our goal is to maintain a positive and supportive community, where help and contributions are valued.
      `);

    await interaction.reply({ embeds: [pointsEmbed] });
  }

  static async displayUserPoints(interaction) {
    const user = interaction.options.getUser('name');
    const response = await axios.get(PointsService.API_URL);

    // eslint-disable-next-line
    const data = response.data.filter((member) => interaction.guild.members.cache.get(member.discord_id));

    let points = 0;
    let rank = 0;
    let name = user.username;

    for (let i = 0; i < data.length; i += 1) {
      if (data[i].discord_id === user.id) {
        points = data[i].points;
        name = interaction.guild.members.cache.get(user.id).displayName;
        rank = i + 1;
        break;
      }
    }

    const userRankReply = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle(`${name} Leaderboard!`)
      .addFields([{ name: 'Points', value: `${name} has ${points === undefined ? 0 : points} point${points === 1 ? '' : 's'}!` }]);

    if (rank >= 1) {
      userRankReply.addFields([{ name: 'Rank', value: `${name} is ranked number ${rank}${rank === 1 ? ' :tada:' : ''}!` }]);
    } else {
      userRankReply.addFields([{ name: 'Rank', value: `${name} currently has no rank in the leaderboard!` }]);
    }

    await interaction.reply({ embeds: [userRankReply] });
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
    const response = await axios.get(PointsService.API_URL);
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
  }
}

module.exports = PointsService;
