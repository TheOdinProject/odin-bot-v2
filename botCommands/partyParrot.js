const {registerBotCommand} = require("../botEngine.js");
const {randomInt} = require("./helpers.js");

registerBotCommand(
  /partyparrot|party_parrot|party parrot|oiseau/,
  ({content}) => {
    const parrots = [
      "http://cultofthepartyparrot.com/parrots/hd/dadparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/vikingparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/angryparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/reverseparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/dealwithitparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/shuffleparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/partyparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/fastparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/ultrafastparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/slowparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/sassyparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/moonwalkingparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/sleepingparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/twinsparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/stableparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/discoparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/beretparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/invisibleparrot.gif",
      "http://giphygifs.s3.amazonaws.com/media/T5NoujI1yVOak/giphy.gif",
      "http://cultofthepartyparrot.com/parrots/hd/githubparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/laptop_parrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/spinningparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/grouchoparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/horizontalparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/backwardsparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/shortparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/bouncingparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/parrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/copparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/aussieparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/hardhatparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/levitationparrot.gif",
      "http://cultofthepartyparrot.com/parrots/hd/verticalparrot.gif",
      "http://cultofthepartyparrot.com/assets/sirocco.gif",
    ]

    const angryFaces = /(>:\(|:angry:|\):<)/g
    
    if (content.toLowerCase().match("!")) {
        return `${parrots[0]}`;
    } else if (content.toLowerCase().match("odin")) {
        return `${parrots[1]}`;
    } else if (content.toLowerCase().match(angryFaces)) {
        return `${parrots[2]}`;
    } else {
        const index = randomInt(parrots.length);
        return `${parrots[index]}`;
    }
  }
);
