const { registerBotCommand } = require("../bot-engine.js");
const { getMentions } = require("./helpers.js");

registerBotCommand(/\/hug/, () => `⊂(´・ω・｀⊂)`);

registerBotCommand(/\/smart/, () => String.raw`f(ಠ‿↼)z`);

registerBotCommand(/\/flip/, () => String.raw`(╯°□°）╯︵ ┻━━━━┻ `);

registerBotCommand(/:fu:/, ({ data }) => {
  const user = data.fromUser.username;
  return `@${user} \n ![Not Nice](http://media.riffsy.com/images/636a97aa416ad674eb2b72d4a6e9ad6c/tenor.gif)`;
});

registerBotCommand(/\/google.*/, ({ text }) => {
  const transform = text => {
    const query = text.split(" ").join("+");
    return `http://lmgtfy.com/?q=${query}`;
  };

  const query = text.match(/(?!\/google.?) .*/)[0].trim();
  return `[Here's your result!](${transform(query)})`;
});

registerBotCommand(/\/gandalf/, () => `[![](http://emojis.slackmojis.com/emojis/images/1450458362/181/gandalf.gif)](http://giphy.com/gifs/B3hcUhLX3BFHa/tile)`);

registerBotCommand(/\/motivate/, ({data, text}) => {
  const user = data.fromUser.username;
  let mentions = getMentions(text);
  if (mentions) mentions = mentions.join(' ');
  else mentions = `@${user}`; // if no one is mentioned, tag the requester
  return `${mentions} Don't give up! https://www.youtube.com/watch?v=KxGRhd_iWuE`;
});

registerBotCommand(/\/justdoit/, ({data, text}) => {
  const user = data.fromUser.username;
  let mentions = getMentions(text);
  if (mentions) mentions = mentions.join(' ');
  else mentions = `@${user}`; // if no one is mentioned, tag the requester
  return `${mentions} What are you waiting for?! https://www.youtube.com/watch?v=ZXsQAXx_ao0`;
});

