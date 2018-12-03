const {registerBotCommand} = require('../botEngine.js');
const {getMentions} = require('./helpers.js');

registerBotCommand(/\/hug/, () => `⊂(´・ω・｀⊂)`);

registerBotCommand(/\/smart/, () => String.raw`f(ಠ‿↼)z`);

// registerBotCommand(/\/flip/, () => String.raw`(╯°□°）╯︵ ┻━━━━┻ `);

registerBotCommand(/\/sexpresso/, () => `https://i.gifer.com/8EC5.gif`);

registerBotCommand(/\peen/, ({author}) => {
  if (author.id == 418918922507780096) {
    return `https://media.giphy.com/media/K5IEMtDZHxQZy/giphy.gif`;
  }
});

registerBotCommand(/\/google.*/, ({content}) => {
  const transform = content => {
    const query = content.split(' ').join('+');
    return `**HERE YOU GO BABY >** <http://lmgtfy.com/?q=${query}>`;
  };

  const query = content.match(/(?!\/google.?) .*/)[0].trim();
  return `${transform(query)}`;
});

registerBotCommand(
  /\/gandalf/,
  () => `http://emojis.slackmojis.com/emojis/images/1450458362/181/gandalf.gif`
);

registerBotCommand(/\/motivate/, () => {
  return `Don't give up! https://www.youtube.com/watch?v=KxGRhd_iWuE`;
});

registerBotCommand(/\/justdoit/, () => {
  return `What are you waiting for?! https://www.youtube.com/watch?v=ZXsQAXx_ao0`;
});
