const axios = require('axios');
const config = require('../config.js');
const { registerBotCommand } = require('../botEngine.js');
const club40Gifs = require('./club_40_gifs.json');
const adminRoles = require('../constants/admin-roles.const.js');

axios.defaults.headers.post.Authorization = `Token ${config.pointsbot.token}`;

function gifPicker(gifContainer, clubChannel) {
  const choice = Math.floor(Math.random() * gifContainer.length);
  clubChannel.send(`${gifContainer[choice].gif}`);
  clubChannel.send(`Gif by ${gifContainer[choice].author}`);
}

function getUserIdsFromMessage(client, author, guild, text, regex, authorMember, channel) {
  const matches = [];
  let match = regex.exec(text);

  while (match !== null) {
    if (match[2] === '?++') {
      let isAdmin = false;
      authorMember.roles.cache.forEach((value) => {
        if (adminRoles.includes(value.name)) {
          isAdmin = true;
        }
      });

      if (isAdmin) {
        matches.push([match[1].replace('!', ''), 2]);
      } else {
        channel.send('Only maintainers or core members can give double points!');
      }
      match = regex.exec(text);
    } else {
      matches.push([match[1].replace('!', ''), 1]);
      match = regex.exec(text);
    }
  }
  return matches;
}

const deductPoints = {
  regex: /(?<!\S)<@!?(\d+)>\s?(--)(?!\S)/,
  cb: () => 'http://media.riffsy.com/images/636a97aa416ad674eb2b72d4a6e9ad6c/tenor.gif',
};

registerBotCommand(deductPoints.regex, deductPoints.cb);

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

async function lookUpUser(discordId) {
  try {
    const pointsBotResponse = await axios.get(
      `https://www.theodinproject.com/api/points/${discordId}`,
    );
    return pointsBotResponse.data;
  } catch (err) {
    return false;
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
  return 'Woot!';
}

function plural(points) {
  return points === 1 ? 'point' : 'points';
}

const userRegex = '<@!?(\\d+)>';
const starRegex = '\u{2b50}';
// matches at least two plus signs
const plusRegex = '(\\+){2,}';
const doublePointsPlusRegex = '\\?(\\+){2,}';

const awardPoints = {
  // uses a negative lookback to isolate the command
  // followed by the Discord User, a whitespace character and either the star or plus incrementer
  regex: new RegExp(
    `(?<!\\S)${userRegex}\\s?(${doublePointsPlusRegex}|${plusRegex}|${starRegex})(?!\\S)`,
    'gu',
  ),
  cb: async function pointsBotCommand({
    author,
    content,
    channel,
    client,
    guild,
    member,
  }) {
    const userIds = getUserIdsFromMessage(
      client,
      author,
      guild,
      content,
      new RegExp(
        `(?<!\\S)${userRegex}\\s?(${doublePointsPlusRegex}|${plusRegex}|${starRegex})(?!\\S)`,
        'gu',
      ),
      member,
      channel,
    );

    const isGoodQuestion = new RegExp(doublePointsPlusRegex).test(content);

    return Promise.all(
      userIds.map(async (userId, i) => {
        if (config.noPointsChannels.includes(channel.id)) {
          channel.send("You can't do that here!");
          return;
        }
        // this limits the number of calls per message to 5 to avoid abuse
        if (i > 4) {
          return;
        }
        if (i === 4) {
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
          if (user) {
            const recipientMember = await guild.members.fetch(user);
            if (
              recipientMember
              && !recipientMember.roles.cache.find((r) => r.name === 'club-40')
              && pointsUser.points > 39
            ) {
              const pointsRole = guild.roles.cache.find(
                (r) => r.name === 'club-40',
              );
              recipientMember.roles.add(pointsRole);
              const clubChannel = client.channels.cache.get(
                '707225752608964628',
              );

              if (clubChannel) {
                clubChannel.send(`HEYYY EVERYONE SAY HI TO ${user} the newest member of CLUB 40. Please check the pins at the top right!`);
                gifPicker(club40Gifs, clubChannel);
              }
            }
            channel.send(
              `${exclamation(pointsUser.points, isGoodQuestion)} ${user} now has ${pointsUser.points
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

registerBotCommand(awardPoints.regex, awardPoints.cb);

const points = {
  regex: /(?<!\S)!points(?!\S)/,
  async cb({
    content, author, client, channel, guild,
  }) {
    const userIds = getUserIdsFromMessage(content, /<@!?(\d+)>/g);
    if (userIds.length === 0) {
      userIds.push(author.id);
    }
    userIds.forEach(async (userId) => {
      const user = await client.users.cache.get(userId);
      try {
        const userPoints = await lookUpUser(user.id);
        if (userPoints) {
          const username = guild.members.cache
            .get(userPoints.discord_id)
            .displayName.replace(/!/g, '!');
          channel.send(`${username} has ${userPoints.points} points!`);
        }
      } catch (err) {
        console.log(err);
      }
    });
  },
};

registerBotCommand(points.regex, points.cb);

const leaderboard = {
  regex: /(?<!\S)!leaderboard(?!\S)/,
  async cb({ guild, content }) {
    try {
      const sEquals = content
        .split(' ')
        .find((word) => word.includes('start='));
      let start = sEquals ? sEquals.replace('start=', '') : 1;
      start = Math.max(start, 1);

      const nEquals = content.split(' ').find((word) => word.includes('n='));
      let length = nEquals ? nEquals.replace('n=', '') : 5;
      length = Math.min(length, 25);
      length = Math.max(length, 1);

      const users = await axios.get(
        'https://www.theodinproject.com/api/points',
      );
      const data = users.data.filter((user) => guild.members.cache.get(user.discord_id));
      let usersList = '**leaderboard** \n';
      for (let i = start - 1; i < length + start - 1; i += 1) {
        const user = data[i];
        if (user) {
          const member = guild.members.cache.get(user.discord_id);
          const username = member
            ? member.displayName.replace(/!/g, '!')
            : undefined;
          if (username) {
            if (i === 0) {
              usersList += `${i + 1} - ${username} [${user.points} points] :tada: \n`;
            } else {
              usersList += `${i + 1} - ${username} [${user.points} points] \n`;
            }
          } else {
            usersList += 'UNDEFINED \n';
          }
        }
      }
      return usersList;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

registerBotCommand(leaderboard.regex, leaderboard.cb);

module.exports = {
  addPointsToUser,
  awardPoints,
  deductPoints,
  getUserIdsFromMessage,
  points,
  leaderboard,
};
