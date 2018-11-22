const axios = require('axios');
const config = require('../config.js');
const {registerBotCommand} = require('../bot-engine.js');

function getNamesFromText(text) {
  const regex = /@([!a-zA-Z0-9-_]+)>\s?(\+\+|:star:)/g;
  let matches = [];
  let match;
  while ((match = regex.exec(text)) !== null)
    matches.push(match[1].replace('!', ''));
  return matches;
}

function getNamesFromTextNoStar(text) {
  console.log(text)
  const regex = /@([!a-zA-Z0-9-_]+)/g;
  let matches = [];
  let match;
  while ((match = regex.exec(text)) !== null)
    matches.push(match[1].replace('!', ''));
  return matches;
}

registerBotCommand(
  /@([!a-zA-Z0-9-_]+)>\s?(\-\-)/,
  () =>
    'http://media.riffsy.com/images/636a97aa416ad674eb2b72d4a6e9ad6c/tenor.gif'
);

async function requestUserFromGitter(username) {
  try {
    const userResponse = await axios.get(
      'https://api.gitter.im/v1/user?q=' + username,
      {
        headers: {Authorization: 'Bearer ' + config.gitter.token}
      }
    );
    const user = userResponse.data.results[0];
    if (user && user.username.toLowerCase() == username.toLowerCase()) {
      return user;
    }
    throw new Error('user not found');
  } catch (err) {
    throw new Error(err.message);
  }
}

async function addPointsToUser(username) {
  try {
    // const user = await requestUserFromGitter(username);
    const pointsBotResponse = await axios.get(
      `https://odin-points-bot-discord.herokuapp.com/search/${username}?access_token=${
        config.pointsbot.token
      }`
    );
    return pointsBotResponse.data;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function lookUpUser(username) {
  try {
    // const user = await requestUserFromGitter(username);
    const pointsBotResponse = await axios.get(
      `https://odin-points-bot-discord.herokuapp.com/search/${username}?access_token=${
        config.pointsbot.token
      }`
    );
    return pointsBotResponse.data;
  } catch (err) {
    throw new Error(err.message);
  }
}

function exclamation(points) {
  if (points < 5) {
    return 'Nice!';
  } else if (points < 25) {
    return 'Sweet!';
  } else if (points < 99) {
    return 'Woot!';
  } else if (points < 105) {
    return 'HOLY CRAP!!';
  } else if (points > 199 && points < 206) {
    return 'DAM SON:';
  } else if (points > 299 && points < 306) {
    return 'OK YOU CAN STOP NOW:';
  } else {
    return 'Woot!';
  }
}

function plural(points) {
  return points === 1 ? 'point' : 'points';
}

async function pointsBotCommand({author, content, channel, client}) {
  const requesterName = author.username;
  const names = getNamesFromText(content);
  names.forEach(async name => {
    const user = await client.users.get(name);
    if (user == author) {
      channel.send('http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif');
      channel.send("You can't do that!");
      return;
    } else if (user === 'odin-bot') {
      channel.send('awwwww shucks... :heart_eyes:');
      return;
    }
    try {
      const pointsUser = await addPointsToUser(user.id);
      if (user) {
        channel.send(
          `${exclamation(pointsUser.points)} ${user} now has ${
            pointsUser.points
          } ${plural(pointsUser.points)}`
        );
      }
    } catch (err) {}
  });
}

registerBotCommand(/@[!a-zA-Z0-9-_]+\s?(\+\+|:star:|)/, pointsBotCommand);

registerBotCommand(/\/points/, async function({content, client, channel, guild}) {
  const names = getNamesFromTextNoStar(content);
  console.log(names)
  names.forEach(async name => {
    const user = await client.users.get(name);
    try {
      const userPoints = await lookUpUser(user.id)
      const username = guild.members.get(name).displayName
      if (userPoints) {
        channel.send(`${username} has ${userPoints.points} points!`)
      }
    } catch (err) {}
  })
})

registerBotCommand(/\/leaderboard/, async function({guild}) {
  try {
    const users = await axios.get(
      `https://odin-points-bot-discord.herokuapp.com/users`
    );
    let usersList = '**leaderboard** \n';
    for (let i = 0; i < 5; i++) {
      const user = users.data[i];
      if (user) {
        const username = guild.members.get(user.name).displayName
        if (i == 0) {
          usersList += ` - ${username} [${user.points} points] :tada: \n`;
        } else {
          usersList += ` - ${username} [${user.points} points] \n`;
        }
      }
    }
    return usersList;
  } catch (err) {
    console.log(err);
  }
});

registerBotCommand(/\/setpoints/, async function({author, content}) {
  if (author.id == 418918922507780096) {
    const id = content
      .split(' ')
      .find(word => word.includes('id='))
      .replace('id=', '');
    const points = content
      .split(' ')
      .find(word => word.includes('p='))
      .replace('p=', '');

    try {
      const pointsBotResponse = await axios.get(
        `https://odin-points-bot-discord.herokuapp.com/users/${id}/set/${points}?access_token=${
          config.pointsbot.token
        }`
      );
      return `SUCCESS: ${pointsBotResponse.data.name} - ${pointsBotResponse.data.points}`
    } catch (err) {}
  } else {
    return `nice try friend... but you can't do that`;
  }
});
