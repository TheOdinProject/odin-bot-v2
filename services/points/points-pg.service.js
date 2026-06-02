const { EmbedBuilder, escapeMarkdown } = require('discord.js');
const db = require('../../db');

class PointsService {
  static async handleInteraction(interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'user':
        await PointsService.displayUserPoints(interaction);
        break;
    }
  }

  static async displayUserPoints(interaction) {
    const requestedUserID = interaction.options.getUser('name').id;
    const guildMember = interaction.guild.members.cache.get(requestedUserID);
    if (!guildMember) {
      await interaction.reply(
        'Sorry, could not find points information for that user!',
      );
      return;
    }

    const allUsers = await PointsService.#getAllMembersDescPoints(
      interaction.guild.members.cache,
    );

    const userInDatabase = allUsers.find(
      ({ discord_id }) => discord_id === requestedUserID,
    ) ?? {
      id: requestedUserID,
      points: 0,
    };

    // rank is 1-indexed
    const rank = allUsers.findIndex((user) => user === userInDatabase) + 1;
    const displayName = escapeMarkdown(guildMember.displayName);

    const userPointsEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle(`TOP Discord points for ${displayName}`)
      .addFields([
        {
          name: 'Points',
          value: `${displayName} has ${userInDatabase.points} point${userInDatabase.points === 1 ? '' : 's'}.`,
        },
      ])
      .addFields([
        {
          name: 'Rank',
          value: rank
            ? `${displayName} is ranked number ${rank}${rank === 1 ? ' :tada:' : '.'}`
            : `${displayName} is not on the leaderboard.`,
        },
      ]);

    await interaction.reply({ embeds: [userPointsEmbed] });
  }

  static async #getAllMembersDescPoints(guildMembers) {
    const { rows } = await db.query(
      'SELECT * FROM points ORDER BY points DESC',
    );
    return rows.filter((user) => guildMembers.has(user.discord_id));
  }
}

module.exports = PointsService;
