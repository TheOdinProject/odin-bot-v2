const { EmbedBuilder, escapeMarkdown } = require('discord.js');
const { MongoClient } = require('mongodb');
const config = require('../../config');

class PointsService {
  // Ideally would be private field but then will not be able to close client process when Jest finishes running
  // Can't set `process.on('beforeExit', cb)` listener to close due to bug
  // where Jest does not trigger 'beforeExit' or 'exit' when it ends
  // https://github.com/jestjs/jest/issues/10927
  static client = new MongoClient(config.databaseURI);
  static users = PointsService.client.db().collection('users');

  static async handleInteraction(interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'user':
        await PointsService.displayUserPoints(interaction);
        break;
      case 'leaderboard':
        await PointsService.displayLeaderboard(interaction);
        break;
      default:
        await PointsService.displayInfo(interaction);
        break;
    }
  }

  static async displayInfo(interaction) {
    const pointsEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Points in the TOP Discord server').setDescription(`
Want to give credit where it's due? Show your appreciation for helpful members in our server by giving them a point! Mention their \`@name\` and add \`++\` or \`:star:\`

**Example:**

\`@username ++\`
\`@username :star:\`

The bot will only detect these in new messages, not message edits.

**Club 40:**

Users who have accumulated 40 points will be awarded a special role in recognition of their consistent helpfulness.
For further details about our roles, please refer to [our discord #roles channel](https://discord.com/channels/505093832157691914/936424264180060200)

**Point Inflation:**

Please don't beg for points or abuse the point system.
We will have a strict moderation policy in place which will include losing access to the bot or participation in the points system.

Our goal is to maintain a positive and supportive community, where help and contributions are valued.
      `);
    const userId = interaction.options.getUser('user');

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [pointsEmbed],
    });
  }

  static async displayLeaderboard(interaction) {
    const allUsers = await PointsService.#getAllSortedUsers(
      interaction.guild.members.cache,
    );

    let limit = interaction.options.getInteger('limit') ?? 5;
    if (limit > 25) {
      limit = 25;
    }

    let offset = interaction.options.getInteger('offset') ?? 0;
    if (offset >= allUsers.length) {
      offset = allUsers.length - 1;
    }

    const leaderboard = allUsers
      .slice(offset, offset + limit)
      .map((user, i) => {
        const displayName = interaction.guild.members.cache.get(
          user.discordID,
        )?.displayName;
        const position = i + offset + 1;
        return `${position}. ${escapeMarkdown(displayName)} - ${user.points}${position === 1 ? ' :tada:' : ''}`;
      });

    const leaderboardEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('TOP Discord points leaderboard')
      .setDescription(
        leaderboard.join('\n') || 'Be the first to earn a point!',
      );

    await interaction.reply({ embeds: [leaderboardEmbed] });
  }

  static async displayUserPoints(interaction) {
    const userID = interaction.options.getUser('name').id;
    const guildMember = interaction.guild.members.cache.get(userID);
    if (!guildMember) {
      await interaction.reply(
        'Sorry, could not find points information for that user!',
      );
      return;
    }

    const allUsers = await PointsService.#getAllSortedUsers(
      interaction.guild.members.cache,
    );

    const userInDatabase = allUsers.find(
      (user) => user.discordID === userID,
    ) ?? {
      id: userID,
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

  static async #getAllSortedUsers(guildMembers) {
    const allUsers = await PointsService.users
      .find()
      .sort({ points: -1 })
      .toArray();
    return allUsers.filter((user) => guildMembers.has(user.discordID));
  }
}

module.exports = PointsService;
