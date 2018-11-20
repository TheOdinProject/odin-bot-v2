require('dotenv').config();

const config = {
  // gitter: {
  //   // gitter token, can be retrieved from https://developer.gitter.im/apps
  //   token: process.env.GITTER_TOKEN,
  //   //array of rooms that the bot should be active in
  //   rooms: [
  //     'TheOdinProject/theodinproject',
  //     'TheOdinProject/Front-End',
  //     'TheOdinProject/Back-End',
  //     'TheOdinProject/Contributing',
  //     'TheOdinProject/Getting-Hired',
  //     'TheOdinProject/ModTeam',
  //     'TheOdinProject/Random',
  //     'TheOdinProject/VIM',
  //     'TheOdinProject/Javascript',
  //     'TheOdinProject/bot-spam-playground',
  //     'TheOdinProject/tech_support',
  //     'codyloyd',
  //     // 'TheOdinProject/secretbotroom'
  //   ],
  //   place: 'chat'
  // },

  // giphy: {
  //   apikey: process.env.GIPHY_API_KEY,
  // },

  pointsbot: {
    token: process.env.POINTSBOT_TOKEN,
  },
};


module.exports = config;
