const {
  EmbedBuilder,
  RESTJSONErrorCodes,
  escapeMarkdown,
} = require('discord.js');
const config = require('../../config');
const db = require('../../db');
const { isAdmin } = require('../../utils/is-admin');
const club40Gifs = require('./club-40-gifs.json');

const MAX_AWARDS = 5;
const SELF_AWARD_GIF = 'http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif';

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
        `Want to give credit where it's due? Show your appreciation for helpful members in our server by giving them a point! Use \`/thanks\` and pick their name, or mention their \`@name\` and add \`++\` or \`:star:\`

**Example:**

\`/thanks user:@username\`
\`@username ++\`
\`@username :star:\`

The bot will only detect \`++\` and \`:star:\` in new messages, not message edits.

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

  // Used by /thanks and /greatquestion.
  static async awardFromInteraction(interaction, { points }) {
    await interaction.deferReply();

    const awards = PointsService.USER_OPTION_NAMES.map((name) =>
      interaction.options.getUser(name),
    )
      .filter(Boolean)
      .map((user) => ({ userId: user.id, points }));
    try {
      const message = await PointsService.award({
        giver: interaction.member,
        channel: interaction.channel,
        guild: interaction.guild,
        awards,
      });
      await interaction.editReply(message);
    } catch (error) {
      // The general error handler would try to reply again, which fails once the reply is deferred
      console.error(error);
      await interaction.editReply(
        'There was an error while executing this command!',
      );
    }
  }

  /**
   * Shared by /thanks, /greatquestion and the ++ / :star: / ?++ inline commands.
   * Validates and saves each award ({ userId, points: 1 or 2 }), updates Club 40,
   * and returns the message to post.
   */
  static async award({ giver, channel, guild, awards }) {
    if (giver.roles.cache.has(config.roles.NOBOTRoleId)) {
      return "You can't give points right now.";
    }
    if (config.channels.noPointsChannelIds.includes(channel.id)) {
      return "You can't give points in this channel!";
    }

    const invalidAwards = new Set();
    // If someone is given points more than once, the biggest valid award counts
    const pointsByUserId = new Map();
    awards.forEach(({ userId, points }) => {
      const isSelfOrBot = userId === giver.id || userId === config.botUserId;
      if (points === 2 && !isSelfOrBot && !isAdmin(giver)) {
        invalidAwards.add('doublePointsWhenNotStaff');
        return;
      }
      pointsByUserId.set(
        userId,
        Math.max(points, pointsByUserId.get(userId) ?? 0),
      );
    });

    const notices = [];
    const recipients = new Map();
    for (const [userId, points] of pointsByUserId) {
      if (userId === giver.id) {
        invalidAwards.add('toSelf');
      } else if (userId === config.botUserId) {
        invalidAwards.add('toBot');
      } else if (recipients.size >= MAX_AWARDS) {
        invalidAwards.add('overLimit');
      } else {
        const member = await PointsService.#fetchMember(guild, userId);
        if (!member) {
          notices.push(`<@${userId}> isn't in the server.`);
        } else if (member.user.bot) {
          notices.push(`${member} is a bot, so can't be given points.`);
        } else {
          recipients.set(userId, { member, points });
        }
      }
    }

    const lines = [];
    if (invalidAwards.has('doublePointsWhenNotStaff')) {
      lines.push('Only staff can give double points!');
    }
    if (invalidAwards.has('toBot')) {
      lines.push('Awwwww shucks... :heart_eyes:');
    }
    if (invalidAwards.has('toSelf')) {
      lines.push(SELF_AWARD_GIF, "You can't give yourself points!");
    }
    if (invalidAwards.has('overLimit')) {
      lines.push(`You can only do up to ${MAX_AWARDS} users at a time...`);
    }
    lines.push(...notices);

    if (!recipients.size) return lines.join('\n');

    const { rows: awardedUsers } = await db.query(
      `
        INSERT INTO points
        SELECT * FROM unnest($1::text[], $2::integer[])
        ON CONFLICT(discord_id)
        DO UPDATE SET points = points.points + EXCLUDED.points
        RETURNING *;
      `,
      [
        Array.from(recipients.keys()),
        Array.from(recipients.values(), ({ points }) => points),
      ],
    );

    for (const { discord_id, points: total } of awardedUsers) {
      const { member, points } = recipients.get(discord_id);
      const isGreatQuestion = points === 2;
      lines.push(
        `${PointsService.#exclamation(total, isGreatQuestion)} ${member} now has ${total} ${total === 1 ? 'point' : 'points'}`,
      );
      await PointsService.#updateClub40(guild, member, total, points);
    }

    return lines.join('\n');
  }

  static async #fetchMember(guild, userId) {
    try {
      return (await guild.members.fetch(userId)) ?? null;
    } catch (error) {
      if (
        error.code === RESTJSONErrorCodes.UnknownMember ||
        error.code === RESTJSONErrorCodes.UnknownUser
      ) {
        return null;
      }
      throw error;
    }
  }

  // Gives the member the Club 40 role and welcomes them if this award took them to 40 or more points.
  static async #updateClub40(guild, member, total, pointsAdded) {
    try {
      if (total < 40 || member.roles.cache.has(config.roles.club40Id)) {
        return;
      }

      const channel = guild.channels.cache.get(config.channels.club40ChannelId);
      const role = guild.roles.cache.get(config.roles.club40Id);
      if (!channel || !role) {
        throw new Error('No club 40 channel and/or role set!');
      }

      await member.roles.add(role);

      const welcomeGif =
        club40Gifs[Math.floor(Math.random() * club40Gifs.length)];
      const welcomeMessage =
        total - pointsAdded < 40
          ? `HEYYY EVERYONE SAY HI TO ${member} the newest member of CLUB 40! Please check the pins at the top right!`
          : `WELCOME BACK TO CLUB 40 ${member}!! Please review the pins at the top right!`;

      await channel.send(welcomeMessage);
      await channel.send(welcomeGif.gif);
      await channel.send(`Gif by ${welcomeGif.author}`);
    } catch (error) {
      console.error(error);
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

  static async #getAllMembersDescPoints(guildMembers) {
    const { rows } = await db.query(
      'SELECT * FROM points ORDER BY points DESC',
    );
    return rows.filter((user) => guildMembers.has(user.discord_id));
  }
}

module.exports = PointsService;
