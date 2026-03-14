const config = require('../../config');
const club40Gifs = require('./club-40-gifs.json');
const { isAdmin } = require('../../utils/is-admin');
const PointsService = require('../../services/points/points-mongo.service');

const temporarilyOnlyRunInDevOrTest = process.env.NODE_ENV !== 'production';

function getRandomClub40Gif() {
  const choice = Math.floor(Math.random() * club40Gifs.length);
  return club40Gifs[choice];
}

function exclamation(points, isGoodQuestion) {
  if (isGoodQuestion) {
    return 'Thanks for the great question!';
  }
  if (points < 5) {
    return 'Nice!';
  }
  if (points < 25) {
    return 'Sweet!';
  }
  if (points < 99) {
    return 'Woot!';
  }
  if (points < 105) {
    return 'HOLY CRAP!!';
  }
  if (points > 199 && points < 206) {
    return 'DAMN SON!';
  }
  if (points > 299 && points < 306) {
    return 'OK YOU CAN STOP NOW!';
  }
  if (points === 1000) {
    return 'ONE THOUSAND POINTS!!!';
  }
  if (points === 4000) {
    return '`// TODO: Implement Club 4000`';
  }
  return 'Woot!';
}

function getPlural(points) {
  return points === 1 ? 'point' : 'points';
}

const userRegex = '<@!?(\\d+)>';
// Don't disallow word chars after :star: - this should be perfectly valid: "@odinbot ⭐thanks!"
const starRegex = '\u{2b50}';
// matches at least two plus signs
const plusRegex = '(\\+){2,}';
const doublePointsPlusRegex = '\\?(\\+){2,}';
// Word chars disallowed after ++-based points chars to prevent awarding points if a user pings someone
// to ask about pre-increment syntax, e.g. "hey @odinbot ++i increments then evaluates, right?"
// but will still allow stuff like punctuation e.g. "thanks @odinbot ++!"
const plusBasedRegex = `(${plusRegex}|${doublePointsPlusRegex})(?!\\w)`;

// https://regexr.com/8gd0p to test this regex
//
// Ensure the user mention is not escaped or encased directly in an inline code block
// Not so simple to detect and prevent user mentions deeper within an inline or fenced code block though
// But this is mostly prevented by Discord escaping user mentions when typing in them, so they won't match userRegex
// Still technically possible by manually pasting something like <@!123456789> ++ in a code block (though it always was)
const awardPointsRegex = new RegExp(
  `(?<!\\\\|\`)${userRegex}\\s*(${plusBasedRegex}|${starRegex})`,
  'gu',
);

const awardPoints = {
  name: 'award points',
  regex: awardPointsRegex,
  cb: async function pointsBotCommand({
    content,
    channel,
    client,
    guild,
    member: author,
  }) {
    // TODO: Remove conditional when old points feature removed
    if (temporarilyOnlyRunInDevOrTest) {
      if (config.channels.noPointsChannelIds.includes(channel.id)) {
        channel.send("You can't give points in this channel!");
        return;
      }
    }

    const awards = new Map();
    let hasNotifiedAboutDoublePoints = false;

    for (const [_, userID, awardType] of content.matchAll(awardPointsRegex)) {
      if (awardType === '?++') {
        if (isAdmin(author)) {
          awards.set(userID, 2);
        } else if (!hasNotifiedAboutDoublePoints) {
          hasNotifiedAboutDoublePoints = true;
          // TODO: Remove conditional when old points feature removed
          if (temporarilyOnlyRunInDevOrTest) {
            channel.send('Only staff can use ?++ to give double points!');
          }
        }
      } else if (awards.get(userID) !== 2) {
        awards.set(userID, 1);
      }
    }

    // TODO: Remove conditional when old points feature removed
    if (temporarilyOnlyRunInDevOrTest) {
      const ODIN_BOT = client.user;
      if (awards.has(ODIN_BOT.id)) {
        channel.send('Awwwww shucks... :heart_eyes:');
        awards.delete(ODIN_BOT.id);
      }
      if (awards.has(author.id)) {
        channel.send('http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif');
        channel.send("You can't give yourself points!");
        awards.delete(author.id);
      }
    }

    const MAX_AWARDS_PER_MESSAGE = 5;
    if (awards.size > MAX_AWARDS_PER_MESSAGE) {
      // TODO: Remove conditional when old points feature removed
      if (temporarilyOnlyRunInDevOrTest) {
        channel.send(
          `You can only do up to ${MAX_AWARDS_PER_MESSAGE} users at a time...`,
        );
      }
    }

    try {
      const databaseUpserts = Array.from(awards)
        .slice(0, MAX_AWARDS_PER_MESSAGE)
        .map(([recipientID, pointsToAward]) =>
          PointsService.users.findOneAndUpdate(
            { discordID: recipientID },
            { $inc: { points: pointsToAward } },
            { upsert: true, returnDocument: 'after' },
          ),
        );
      const updatedUsers = await Promise.all(databaseUpserts);

      // TODO: Remove conditional when old points feature removed
      if (temporarilyOnlyRunInDevOrTest) {
        for (const { discordID, points } of updatedUsers) {
          const awardedMember = guild.members.cache.get(discordID);
          const isDoublePoints = awards.get(discordID) === 2;
          channel.send(
            `${exclamation(points, isDoublePoints)} ${awardedMember} now has ${points} ${getPlural(points)}`,
          );

          const isInClub40 = awardedMember.roles.cache.has(
            config.roles.club40Id,
          );
          if (points < 40 || isInClub40) {
            continue;
          }

          const club40Channel = guild.channels.cache.get(
            config.channels.club40ChannelId,
          );
          const club40Role = guild.roles.cache.get(config.roles.club40Id);
          if (!club40Channel || !club40Role) {
            throw new Error('No club 40 channel and/or role set!');
          }

          awardedMember.roles.add(club40Role);

          const isNewToClub40 = points === (isDoublePoints ? 41 : 40);
          const welcomeGif = getRandomClub40Gif();
          const welcomeMessage = isNewToClub40
            ? `HEYYY EVERYONE SAY HI TO ${awardedMember} the newest member of CLUB 40! Please check the pins at the top right!`
            : `WELCOME BACK TO CLUB 40 ${awardedMember}!! Please review the pins at the top right!`;

          club40Channel.send(welcomeMessage);
          club40Channel.send(welcomeGif.gif);
          club40Channel.send(`Gif by ${welcomeGif.author}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = awardPoints;
