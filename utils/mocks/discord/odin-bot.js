const { ClientUser } = require('discord.js');

const ID = '513097121482932253';

const odinBot = new ClientUser(null, {
  data: { id: ID, points: 0 },
});
odinBot.id = ID;

module.exports = odinBot;
