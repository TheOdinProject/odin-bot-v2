const axios = require('axios');
const config = require('../../config');
const club40Gifs = require('./club-40-gifs.json');
const { isAdmin } = require('../../utils/is-admin');

axios.default.defaults.headers.common.Authorization = `Token ${config.pointsbot.token}`;

function gifPicker(gifContainer, clubChannel) {
  const choice = Math.floor(Math.random() * gifContainer.length);
  clubChannel.send(`${gifContainer[choice].gif}`);
  clubChannel.send(`Gif by ${gifContainer[choice].author}`);
}

function getUserIdsFromMessage(text, regex, authorMember, channel) {
  const matches = [];
  const processedIDs = [];
  let match = regex.exec(text);

  while (match !== null) {
    const userID = match[1].replace('!', '');
    if (match[2] === '?++') {
      if (isAdmin(authorMember)) {
        matches.push([userID, 2]);
      } else {
        channel.send(
          'Only maintainers or core members can give double points!',
        );
      }
      match = regex.exec(text);
    } else {
      if (processedIDs.includes(userID)) {
        channel.send(
          'Only maintainers or core members can give double points!',
        );
      } else {
        processedIDs.push(userID);
        matches.push([userID, 1]);
      }
      match = regex.exec(text);
    }
  }
  return matches;
}

async function addPointsToUser(discordId, numPoints) {
  try {
    const pointsBotResponse = await axios.post(
      `https://www.theodinproject.com/api/points?discord_id=${discordId}&value=${numPoints}`,
    );
    return pointsBotResponse.data;
  } catch (err) {
    throw new Error(err.message);
  }
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
    return 'DAM SON:';
  }
  if (points > 299 && points < 306) {
    return 'OK YOU CAN STOP NOW:';
  }
  if (points === 1000) {
    return 'ONE THOUSAND POINTS';
  }
  if (points === 4000) {
    return '`//TODO: Implement Club 4000`';
  }
  return 'Woot!';
}

function plural(points) {
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
const fullAwardPointsRegex = new RegExp(
  `(?<!\\\\|\`)${userRegex}\\s*(${plusBasedRegex}|${starRegex})`,
  'gu',
);

const awardPoints = {
  name: 'award points',
  regex: fullAwardPointsRegex,
  cb: async function pointsBotCommand({
    author,
    content,
    channel,
    client,
    guild,
    member,
  }) {
    const userIds = getUserIdsFromMessage(
      content,
      fullAwardPointsRegex,
      member,
      channel,
    );

    const MAX_POINTS_CALLS_PER_MESSAGE = 5;

    return Promise.all(
      userIds.map(async (userId, i) => {
        if (config.channels.noPointsChannelIds.includes(channel.id)) {
          channel.send("You can't do that here!");
          return;
        }
        // this limits the number of calls per message to 5 to avoid abuse
        if (i >= MAX_POINTS_CALLS_PER_MESSAGE) {
          return;
        }
        if (
          i === MAX_POINTS_CALLS_PER_MESSAGE - 1 &&
          userIds.length > MAX_POINTS_CALLS_PER_MESSAGE
        ) {
          channel.send('you can only do 5 at a time..... ');
        }
        const user = await client.users.cache.get(userId[0]);
        if (user === author) {
          channel.send('http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif');
          channel.send("You can't do that!");
          return;
        }
        if (user === client.user) {
          channel.send('awwwww shucks... :heart_eyes:');
          return;
        }
        try {
          const pointsUser = await addPointsToUser(user.id, userId[1]);
          const previousPoints = pointsUser.points - userId[1];
          if (user) {
            const recipientMember = await guild.members.fetch(user);
            if (
              recipientMember &&
              !recipientMember.roles.cache.find((r) => r.name === 'club-40') &&
              pointsUser.points > 39
            ) {
              const pointsRole = guild.roles.cache.find(
                (r) => r.name === 'club-40',
              );
              recipientMember.roles.add(pointsRole);
              const clubChannel =
                client.channels.cache.get('707225752608964628');

              if (clubChannel) {
                const welcomeMessage =
                  previousPoints < 40
                    ? `HEYYY EVERYONE SAY HI TO ${user} the newest member of CLUB 40. Please check the pins at the top right!`
                    : `WELCOME BACK TO CLUB 40 ${user}!! Please review the pins at the top right!`;
                clubChannel.send(welcomeMessage);
                gifPicker(club40Gifs, clubChannel);
              }
            }
            const isGoodQuestion = userId[1] === 2;
            channel.send(
              `${exclamation(pointsUser.points, isGoodQuestion)} ${user} now has ${
                pointsUser.points
              } ${plural(pointsUser.points)}`,
            );
          }
        } catch (err) {
          console.log(err);
        }
      }),
    );
  },
};

module.exports = awardPoints;
