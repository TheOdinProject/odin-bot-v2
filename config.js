require('dotenv').config();

const config = {
  pointsbot: {
    token: process.env.POINTSBOT_TOKEN,
  },
  noPointsChannels: ['513125912070455296'],
};

module.exports = config;
