const axios = require('axios');
const config = require('../config.js');
const {registerBotCommand} = require('../bot-engine.js');

function getNamesFromText(text) {
  const regex = /@([a-zA-Z0-9-_]+)\s?(\+\+|:star:)/g;
  let matches = [];
  let match;
  while ((match = regex.exec(text)) !== null)
    matches.push(match[1]);
  return matches;
}

registerBotCommand(/@[a-zA-Z0-9-_]+\s?(\-\-)/, () => '![Not Nice](http://media.riffsy.com/images/636a97aa416ad674eb2b72d4a6e9ad6c/tenor.gif)');

async function requestUserFromGitter(username) {
  try {
    const userResponse = await axios.get('https://api.gitter.im/v1/user?q=' + username , {
      headers: {Authorization: 'Bearer ' + config.gitter.token}
    });
    const user = userResponse.data.results[0];
    if (user && user.username.toLowerCase() == username.toLowerCase()) {
      return (user);
    }
    throw new Error('user not found');
  } catch (err) {
    throw new Error(err.message);
  }
}

async function addPointsToUser(username) {
  try {
    const user = await requestUserFromGitter(username);
    const pointsBotResponse = await axios.get(`https://odin-points-bot.herokuapp.com/search/${user.username}?access_token=${config.pointsbot.token}`);
    console.log(pointsBotResponse.data);
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

async function pointsBotCommand({data, text, room}) {
  const requesterName = data.fromUser.username;
  const names = getNamesFromText(text);
  names.forEach(async name => {
    if (name.toLowerCase() == requesterName.toLowerCase()) {
      room.send('![](http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif)');
      room.send("You can't do that!");
      return;
    } else if (name === 'odin-bot') {
      room.send('awwwww shucks... :heart_eyes:');
      return;
    }
    try {
      const user = await addPointsToUser(name);
      if (user) {
        room.send(`${exclamation(user.points)} @${user.name} now has ${user.points} ${plural(user.points)}`);
      }
    } catch (err) {
      room.send(`Hmmm... not sure I know ${user.name} did you spell it correctly?`);
    }
  });
}

registerBotCommand(/@[a-zA-Z0-9-_]+\s?(\+\+|:star:|)/, pointsBotCommand);

registerBotCommand(/\/leaderboard/, async function (){
  try {
    const users = await axios.get(`https://odin-points-bot.herokuapp.com/users?access_token=${config.pointsbot.token}`) ;
    let usersList = '##leaderboard [![partytime](http://cultofthepartyparrot.com/parrots/parrot.gif)](http://cultofthepartyparrot.com/parrots/parrot.gif) \n';
    for(let i = 0; i < 10; i++) {
      const user = users.data[i];
      if (i == 0) {
        usersList += ` - ${user.name} [${user.points} points] :tada: \n`;
      } else {
        usersList += ` - ${user.name} [${user.points} points] \n`;
      }
    }
    usersList += ` - see the full leaderboard [here](https://odin-bot.github.io) \n`;
    return usersList;
  } catch (err) {
    console.log(err);
  }
});

