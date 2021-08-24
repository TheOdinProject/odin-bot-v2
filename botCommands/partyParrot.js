const { registerBotCommand } = require('../botEngine.js');
const { randomInt } = require('./helpers.js');

const command = {
  regex: /partyparrot|party_parrot|party parrot|oiseau/,
  cb: ({ content }) => {
    const parrots = [
      'https://cultofthepartyparrot.com/parrots/hd/dadparrot.gif',
      'http://cultofthepartyparrot.com/parrots/parrot.gif',
      'http://cultofthepartyparrot.com/parrots/fiestaparrot.gif',
      'http://cultofthepartyparrot.com/parrots/explodyparrot.gif',
      'http://cultofthepartyparrot.com/parrots/slomoparrot.gif',
      'http://cultofthepartyparrot.com/parrots/hd/dealwithitparrot.gif',
      'http://cultofthepartyparrot.com/parrots/tripletsparrot.gif',
      'http://emojis.slackmojis.com/emojis/images/1450738632/246/leftshark.png',
    ];

    if (content.match('!')) {
      return `${parrots[0]}`;
    }
    const index = randomInt(parrots.length);
    return `${parrots[index]}`;
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
