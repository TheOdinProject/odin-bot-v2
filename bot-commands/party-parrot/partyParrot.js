const { randomInt } = require('../../utils/random-int');

const command = {
  data: { name: 'party parrot' },
  isManuallyRegistrable: true,
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
      'https://emoji.gg/assets/emoji/6379_vikingparrot.gif',
      'https://emoji.gg/assets/emoji/8201-mr-parrot.gif',
      'https://emoji.gg/assets/emoji/6433_wineparrot.gif',
      'https://emoji.gg/assets/emoji/1085_sleepingparrot.gif',
      'https://emoji.gg/assets/emoji/2282_scienceparrot.gif',
      'https://emoji.gg/assets/emoji/3147_thefastestparrot.gif',
      'https://emoji.gg/assets/emoji/9386_thumbsupparrot.gif',
    ];

    if (content.match('!')) {
      return `${parrots[0]}`;
    }
    const index = randomInt(parrots.length);
    return `${parrots[index]}`;
  },
};

module.exports = command;
