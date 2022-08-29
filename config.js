require('dotenv').config();

const config = {
  pointsbot: {
    token: process.env.POINTSBOT_TOKEN,
  },
  noPointsChannels: ['513125912070455296', '948409662255026227'],
};

module.exports = config;
