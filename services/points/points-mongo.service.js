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
    if (interaction.options.getSubcommand() === 'user') {
      await PointsService.displayUserPoints(interaction);
    }
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
