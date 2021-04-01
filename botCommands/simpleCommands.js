const { registerBotCommand } = require('../botEngine.js');

const hug = {
  regex: /(?<!\S)\/hug(?!\S)/,
  cb: () => '⊂(´・ω・｀⊂)',
};
registerBotCommand(hug.regex, hug.cb);

const smart = {
  regex: /(?<!\S)\/smart(?!\S)/,
  cb: () => String.raw`f(ಠ‿↼)z`,
};
registerBotCommand(smart.regex, smart.cb);

const lenny = {
  regex: /(?<!\S)\/lenny(?!\S)/,
  cb: () => String.raw`( ͡° ͜ʖ ͡°)`,
};
registerBotCommand(lenny.regex, lenny.cb);

const fu = {
  regex: /(?<!\S)\/fu(?!\S)/,
  cb: async (message) => {
    await message.reply('http://media.riffsy.com/images/636a97aa416ad674eb2b72d4a6e9ad6c/tenor.gif');
    return null;
  },
};
registerBotCommand(fu.regex, fu.cb);

const question = {
  regex: /(?<!\S)\/question(?!\S)/,
  cb: () => '**We\'d love to help you out! Check out this article to help others better understand your question: https://medium.com/@gordon_zhu/how-to-be-great-at-asking-questions-e37be04d0603**',
};
registerBotCommand(question.regex, question.cb);

const data = {
  regex: /(?<!\S)\/data(?!\S)/,
  cb: () => '**Please state your question in the form of a question! https://www.dontasktoask.com/**',
};
registerBotCommand(data.regex, data.cb);

const google = {
  regex: /\B\/google\s+.+/,
  cb: ({ content }) => {
    const transform = (transformContent) => {
      const query = transformContent.split(' ').map(encodeURIComponent).join('+');
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
    const transform = (transformContent) => {
      const query = transformContent.split(' ').map(encodeURIComponent).join('+');
      return `**This is what you should have typed into Google >** <https://google.com/search?q=${query}>`;
    };

    const query = content.match(/\B\/fg\s+(.+)/)[1];
    return `${transform(query)}`;
  },
};
registerBotCommand(fg.regex, fg.cb);

const dab = {
  regex: /(?<!\S)\/dab(?!\S)/,
  cb: () => 'https://tenor.com/view/bettywhite-dab-gif-5044603',
};
registerBotCommand(dab.regex, dab.cb);

const gandalf = {
  regex: /(?<!\S)\/gandalf(?!\S)/,
  cb: () => 'http://emojis.slackmojis.com/emojis/images/1450458362/181/gandalf.gif',
};
registerBotCommand(gandalf.regex, gandalf.cb);

const motivate = {
  regex: /(?<!\S)\/motivate(?!\S)/,
  cb: () => 'Don\'t give up! https://www.youtube.com/watch?v=KxGRhd_iWuE',
};
registerBotCommand(motivate.regex, motivate.cb);

const justDoIt = {
  regex: /(?<!\S)\/justdoit(?!\S)/,
  cb: () => 'What are you waiting for?! https://www.youtube.com/watch?v=ZXsQAXx_ao0',
};
registerBotCommand(justDoIt.regex, justDoIt.cb);

const xy = {
  regex: /(?<!\S)\/xy(?!\S)/,
  cb: () => 'What problem are you *really* trying to solve? Check out this article to help others better understand your question: <https://xyproblem.info/>',
};
registerBotCommand(xy.regex, xy.cb);

module.exports = {
  hug,
  smart,
  lenny,
  fu,
  question,
  data,
  google,
  fg,
  dab,
  gandalf,
  motivate,
  justDoIt,
  xy,
};
