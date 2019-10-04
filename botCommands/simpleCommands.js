const {registerBotCommand} = require('../botEngine.js');

registerBotCommand(/\B\/hug\b/, () => `⊂(´・ω・｀⊂)`);

registerBotCommand(/\/smart/, () => String.raw`f(ಠ‿↼)z`);

// registerBotCommand(/\/flip/, () => String.raw`(╯°□°）╯︵ ┻━━━━┻ `);

registerBotCommand(/\/sexpresso/, () => `https://i.gifer.com/8EC5.gif`);

registerBotCommand(/\peen/, ({author}) => {
  if (author.id == 418918922507780096) {
    return `https://media.giphy.com/media/K5IEMtDZHxQZy/giphy.gif`;
  }
});

registerBotCommand(/\B\/google\s+.+/, ({content}) => {
  const transform = content => {
    const query = content.split(' ').map(encodeURIComponent).join('+');
    return `**HERE YOU GO BABY >** <https://lmgtfy.com/?q=${query}>`;
  };

  const query = content.match(/\B\/google\s+(.+)/)[1];
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

registerBotCommand(/\/pairs/, () => {
  return `**Find your coding partner here:** https://forum.theodinproject.com/c/pairs`;
});
