const {registerBotCommand} = require("../bot-engine.js");
const {getMentions} = require("./helpers.js");

registerBotCommand(/\/hug/, () => `⊂(´・ω・｀⊂)`);

registerBotCommand(/\/smart/, () => String.raw`f(ಠ‿↼)z`);

registerBotCommand(/\/flip/, () => String.raw`(╯°□°）╯︵ ┻━━━━┻ `);

registerBotCommand(/\/google.*/, ({content}) => {
  const transform = content => {
    const query = content.split(" ").join("+");
    return `http://lmgtfy.com/?q=${query}`;
  };

  const query = content.match(/(?!\/google.?) .*/)[0].trim();
  return `${transform(query)}`;
});

registerBotCommand(/\/gandalf/, () => `http://emojis.slackmojis.com/emojis/images/1450458362/181/gandalf.gif`);

registerBotCommand(/\/motivate/, ({author, content}) => {
  const user = author.username;
  let mentions = getMentions(content);
  if (mentions) mentions = mentions.join(' ');
  else mentions = `@${user}`; // if no one is mentioned, tag the requester
  return `${mentions} Don't give up! https://www.youtube.com/watch?v=KxGRhd_iWuE`;
});

registerBotCommand(/\/justdoit/, ({author, content}) => {
  const user = author.username;
  let mentions = getMentions(content);
  if (mentions) mentions = mentions.join(' ');
  else mentions = `@${user}`; // if no one is mentioned, tag the requester
  return `${mentions} What are you waiting for?! https://www.youtube.com/watch?v=ZXsQAXx_ao0`;
});

