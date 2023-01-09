const Discord = require('discord.js');
const axios = require('axios');
const { registerBotCommand } = require('../botEngine.js');

const leaderboard = {
  regex: /(?<!\S)!leaderboard(?!\S)/,
  async cb({ guild, content }) {
    try {
      const sEquals = content
        .split(' ')
        .find((word) => word.includes('start='));
      let start = sEquals ? sEquals.replace('start=', '') : 1;
      start = Number.isNaN(Number(start)) ? 1 : Math.max(start, 1);

      const nEquals = content.split(' ').find((word) => word.includes('n='));
      let length = nEquals ? nEquals.replace('n=', '') : 5;
      length = Number.isNaN(Number(length)) ? 5 : length;
      length = Math.min(length, 25);
      length = Math.max(length, 1);

      const { data: users } = await axios.get(
        `https://www.theodinproject.com/api/points?limit=${length}&offset=${start - 1}`,
      );
      let usersList = '';
      for (let i = 0; i < length; i += 1) {
        const user = users[i];
        if (user) {
          // on user leave guild: remove user from server?
          const member = guild.members.cache.get(user.discord_id);
          const username = member
            ? member.displayName.replace(/!/g, '!')
            : undefined;
          if (username) {
            if (i === 0 && start - 1 === 0) {
              usersList += `${start + i} - ${username} [${user.points} points] :tada: \n`;
            } else {
              usersList += `${start + i} - ${username} [${user.points} points] \n`;
            }
          } else {
            usersList += 'UNDEFINED \n';
          }
        }
      }

      const leaderboardEmbed = new Discord.EmbedBuilder()
        .setColor('#cc9543')
        .setTitle('Leaderboard')
        .addFields([{ name: 'In Odin We Trust', value: usersList || 'Be the first to earn a point!' }]);

      return { embeds: [leaderboardEmbed] };
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

registerBotCommand(leaderboard.regex, leaderboard.cb);

module.exports = {
  leaderboard,
};
