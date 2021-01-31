/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-shadow */

const { registerBotCommand } = require('../botEngine.js');

const hug = {
  regex: /\B\/hug(?!\S)/,
  cb: () => '⊂(´・ω・｀⊂)',
};
registerBotCommand(hug.regex, hug.cb);

const smart = {
  regex: /\B\/smart(?!\S)/,
  cb: () => String.raw`f(ಠ‿↼)z`,
};
registerBotCommand(smart.regex, smart.cb);

const lenny = {
  regex: /\B\/lenny(?!\S)/,
  cb: () => String.raw`( ͡° ͜ʖ ͡°)`,
};
registerBotCommand(lenny.regex, lenny.cb);

const fu = {
  regex: /\B\/fu(?!\S)/,
  cb: async (message) => {
    await message.reply(
      'http://media.riffsy.com/images/636a97aa416ad674eb2b72d4a6e9ad6c/tenor.gif'
    );
    return null;
  },
};
registerBotCommand(fu.regex, fu.cb);

const question = {
  regex: /\B\/question(?!\S)/,
  cb: () =>
    "**It looks like you're trying to ask a question! Please give this page a read: https://medium.com/@gordon_zhu/how-to-be-great-at-asking-questions-e37be04d0603**",
};
registerBotCommand(question.regex, question.cb);

const data = {
  regex: /\B\/data(?!\S)/,
  cb: () =>
    '**Please state your question in the form of a question! https://www.dontasktoask.com/**',
};
registerBotCommand(data.regex, data.cb);

// registerBotCommand(/\/sexpresso/, () => `https://i.gifer.com/8EC5.gif`);

const sexpresso = {
  regex: /\B\/sexpresso(?!\S)/,
  cb: () => 'https://tenor.com/view/mac-spilling-coffee-starbucks-gif-6241590',
};
registerBotCommand(sexpresso.regex, sexpresso.cb);

const peen = {
  regex: /\B\/peen(?!\S)/,
  cb: ({ author }) => {
    if (author.id === 418918922507780096) {
      return 'https://media.giphy.com/media/K5IEMtDZHxQZy/giphy.gif';
    }
  },
};
registerBotCommand(peen.regex, peen.cb);

const google = {
  regex: /\B\/google\s+.+/,
  cb: ({ content }) => {
    const transform = (content) => {
      const query = content
        .split(' ')
        .map(encodeURIComponent)
        .join('+');
      return `**HERE YOU GO BABY >** <https://lmgtfy.com/?q=${query}>`;
    };

    const query = content.match(/\B\/google\s+(.+)/)[1];
    return `${transform(query)}`;
  },
};
registerBotCommand(google.regex, google.cb);

const fg = {
  regex: /\B\/fg\s+.+/,
  cb: ({ content }) => {
    const transform = (content) => {
      const query = content
        .split(' ')
        .map(encodeURIComponent)
        .join('+');
      return `**This is what you should have typed into Google >** <https://google.com/search?q=${query}>`;
    };

    const query = content.match(/\B\/fg\s+(.+)/)[1];
    return `${transform(query)}`;
  },
};
registerBotCommand(fg.regex, fg.cb);

const dab = {
  regex: /\B\/dab(?!\S)/,
  cb: () => 'https://tenor.com/view/bettywhite-dab-gif-5044603',
};
registerBotCommand(dab.regex, dab.cb);

const gandalf = {
  regex: /\B\/gandalf(?!\S)/,
  cb: () =>
    'http://emojis.slackmojis.com/emojis/images/1450458362/181/gandalf.gif',
};
registerBotCommand(gandalf.regex, gandalf.cb);

const motivate = {
  regex: /\B\/motivate(?!\S)/,
  cb: () => "Don't give up! https://www.youtube.com/watch?v=KxGRhd_iWuE",
};
registerBotCommand(motivate.regex, motivate.cb);

const justDoIt = {
  regex: /\B\/justdoit(?!\S)/,
  cb: () =>
    'What are you waiting for?! https://www.youtube.com/watch?v=ZXsQAXx_ao0',
};
registerBotCommand(justDoIt.regex, justDoIt.cb);

module.exports = {
  hug,
  smart,
  lenny,
  fu,
  question,
  data,
  sexpresso,
  peen,
  google,
  fg,
  dab,
  gandalf,
  motivate,
  justDoIt,
};
