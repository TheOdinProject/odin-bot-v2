const { EmbedBuilder, MessageFlags, escapeMarkdown } = require('discord.js');
const config = require('../../config');
const db = require('../../db');
const club40Gifs = require('./club-40-gifs.json');

const selfAwardGif = 'http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif';

class PointsService {
  static USER_OPTION_NAMES = ['user', 'user2', 'user3', 'user4', 'user5'];

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
      .setTitle('Points in the TOP Discord server')
      .setDescription(
        `Want to give credit where it's due? Show your appreciation for helpful members in our server by giving them a point! Use \`/thanks\` and pick their name.

**Example:**

\`/thanks user:@username\`

**Club 40:**

Users who have accumulated 40 points will be awarded a special role in recognition of their consistent helpfulness.
For further details about our roles, please refer to [our discord #roles channel](https://discord.com/channels/505093832157691914/936424264180060200)

**Point Inflation:**

Please don't beg for points or abuse the point system.
We have a strict moderation policy in place, including losing access to the bot or participation in the points system.

Our goal is to maintain a positive and supportive community, where help and contributions are valued.`,
      );
    const userId = interaction.options.getUser('user');

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [pointsEmbed],
    });
  }

  static async displayLeaderboard(interaction) {
    const allUsers = await PointsService.#getAllMembersDescPoints(
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
          user.discord_id,
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
    const username = escapeMarkdown(guildMember.user.username);

    const userPointsEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle(`TOP Discord points for ${displayName} *(${username})*`)
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

  static async awardPoints(interaction, { isGreatQuestion = false } = {}) {
    const { member: giver, channel, guild } = interaction;

    if (giver.roles.cache.has(config.roles.NOBOTRoleId)) {
      await PointsService.#replyPrivately(
        interaction,
        "You can't give points right now.",
      );
      return;
    }
    if (config.channels.noPointsChannelIds.includes(channel.id)) {
      await PointsService.#replyPrivately(
        interaction,
        "You can't give points in this channel!",
      );
      return;
    }

    const club40Channel = guild.channels.cache.get(
      config.channels.club40ChannelId,
    );
    const club40Role = guild.roles.cache.get(config.roles.club40Id);
    if (!club40Channel || !club40Role) {
      throw new Error('No club 40 channel and/or role set!');
    }

    const publicLines = [];
    const privateLines = [];
    const recipients = new Map();

    for (const optionName of PointsService.USER_OPTION_NAMES) {
      const user = interaction.options.getUser(optionName);
      if (!user || recipients.has(user.id)) continue;

      const member = interaction.options.getMember(optionName);
      if (user.id === giver.id) {
        publicLines.push(selfAwardGif, "You can't give yourself points!");
      } else if (user.id === config.botUserId) {
        publicLines.push('Awwwww shucks... :heart_eyes:');
      } else if (user.bot) {
        privateLines.push(`${user} is a bot, so can't be given points.`);
      } else if (!member) {
        privateLines.push(`${user} isn't in the server.`);
      } else {
        recipients.set(user.id, member);
      }
    }

    const pointsEach = isGreatQuestion ? 2 : 1;
    const ids = Array.from(recipients.keys());
    const { rows: awardedUsers } = ids.length
      ? await db.query(
          `
            INSERT INTO points
            SELECT * FROM unnest($1::text[], $2::integer[])
            ON CONFLICT(discord_id)
            DO UPDATE SET points = points.points + EXCLUDED.points
            RETURNING *;
          `,
          [ids, ids.map(() => pointsEach)],
        )
      : { rows: [] };

    const newClub40Members = [];
    for (const { discord_id, points } of awardedUsers) {
      const member = recipients.get(discord_id);
      publicLines.push(
        `${PointsService.#exclamation(points, isGreatQuestion)} ${member} now has ${points} ${points === 1 ? 'point' : 'points'}`,
      );

      if (points >= 40 && !member.roles.cache.has(config.roles.club40Id)) {
        newClub40Members.push({
          member,
          isNew: points - pointsEach < 40,
        });
      }
    }

    if (publicLines.length) {
      await interaction.reply(publicLines.join('\n'));
      if (privateLines.length) {
        await interaction.followUp({
          content: privateLines.join('\n'),
          flags: MessageFlags.Ephemeral,
        });
      }
    } else {
      await PointsService.#replyPrivately(interaction, privateLines.join('\n'));
    }

    // The interaction has already been replied to, so Club 40 errors are only logged
    for (const { member, isNew } of newClub40Members) {
      try {
        await member.roles.add(club40Role);

        const welcomeGif =
          club40Gifs[Math.floor(Math.random() * club40Gifs.length)];
        const welcomeMessage = isNew
          ? `HEYYY EVERYONE SAY HI TO ${member} the newest member of CLUB 40! Please check the pins at the top right!`
          : `WELCOME BACK TO CLUB 40 ${member}!! Please review the pins at the top right!`;

        await club40Channel.send(welcomeMessage);
        await club40Channel.send(welcomeGif.gif);
        await club40Channel.send(`Gif by ${welcomeGif.author}`);
      } catch (error) {
        console.error(error);
      }
    }
  }

  static #exclamation(points, isGreatQuestion) {
    if (isGreatQuestion) return 'Thanks for the great question!';
    if (points < 5) return 'Nice!';
    if (points < 25) return 'Sweet!';
    if (points < 99) return 'Woot!';
    if (points < 105) return 'HOLY CRAP!!';
    if (points > 199 && points < 206) return 'DAMN, SON!';
    if (points > 299 && points < 306) return 'OK, YOU CAN STOP NOW!';
    if (points === 1000) return 'ONE THOUSAND POINTS!!!';
    if (points === 4000) return '`// TODO: Implement Club 4000`';
    return 'Woot!';
  }

  static async #replyPrivately(interaction, content) {
    await interaction.reply({ content, flags: MessageFlags.Ephemeral });
  }

  static async #getAllMembersDescPoints(guildMembers) {
    const { rows } = await db.query(
      'SELECT * FROM points ORDER BY points DESC',
    );
    return rows.filter((user) => guildMembers.has(user.discord_id));
  }
}

module.exports = PointsService;
