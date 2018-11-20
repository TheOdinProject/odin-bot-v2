const {registerBotCommand} = require("../bot-engine.js");
const {randomInt} = require("./helpers.js");

registerBotCommand(
  /partyparrot|party_parrot|party parrot|oiseau/,
  ({content}) => {
    const parrots = [
      "http://cultofthepartyparrot.com/parrots/parrotdad.gif",
      "http://cultofthepartyparrot.com/parrots/parrot.gif",
      "http://cultofthepartyparrot.com/parrots/shuffleparrot.gif",
      "http://cultofthepartyparrot.com/parrots/parrotcop.gif",
      "http://cultofthepartyparrot.com/parrots/fiestaparrot.gif",
      "http://cultofthepartyparrot.com/parrots/explodyparrot.gif",
      "http://cultofthepartyparrot.com/parrots/aussieparrot.gif",
      "http://cultofthepartyparrot.com/parrots/slomoparrot.gif",
      "http://cultofthepartyparrot.com/parrots/stableparrot.gif",
      "http://cultofthepartyparrot.com/parrots/twinsparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/dealwithitparrot.gif",
      "http://cultofthepartyparrot.com/parrots/tripletsparrot.gif",
      "http://emojis.slackmojis.com/emojis/images/1450738632/246/leftshark.png",
      "http://emojis.slackmojis.com/emojis/images/1472757675/1132/otter-dance.gif"
    ];

   if (content.toLowerCase().match("!")) {
      return `${parrots[0]}`;
    } else {
      const index = randomInt(parrots.length);
      return `${parrots[index]}`;
    }
  }
);
