const Discord = require('discord.js');
const { registerBotCommand } = require('../botEngine');

const hug = {
  regex: /(?<!\S)!hug(?!\S)/,
  cb: () => '⊂(´・ω・｀⊂)',
};
registerBotCommand(hug.regex, hug.cb);

const smart = {
  regex: /(?<!\S)!smart(?!\S)/,
  cb: () => String.raw`f(ಠ‿↼)z`,
};
registerBotCommand(smart.regex, smart.cb);

const lenny = {
  regex: /(?<!\S)!lenny(?!\S)/,
  cb: () => String.raw`( ͡° ͜ʖ ͡°)`,
};
registerBotCommand(lenny.regex, lenny.cb);

const fu = {
  regex: /(?<!\S)!fu(?!\S)/,
  cb: async (message) => {
    await message.reply('http://media.riffsy.com/images/636a97aa416ad674eb2b72d4a6e9ad6c/tenor.gif');
    return null;
  },
};
registerBotCommand(fu.regex, fu.cb);

const data = {
  regex: /(?<!\S)!data(?!\S)/,
  cb: () => {
    const dataEmbed = new Discord.EmbedBuilder()
      .setTitle('Don’t ask to ask!')
      .setColor('#cc9543')
      .setURL('https://www.dontasktoask.com/')
      // this weird formating is needed because of some indentation on mobile
      .setDescription(`
Instead of asking if anyone can help you, ask your question outright with as much information as possible so people will know if they can help you.

**Bad**: "Hey, anyone around that is really good with CSS?"

**Good**:
"Hey, I'm having trouble setting CSS styles via Javascript."

**Project/Exercise:**
**Lesson link:**
**Code:** [code sandbox like replit or codepen]
**Issue/Problem:** [screenshots if applicable]
**What I expected:** 
**What I've tried:** 

**https://www.dontasktoask.com/**
        `);

    return { embeds: [dataEmbed] };
  },
};
registerBotCommand(data.regex, data.cb);

const google = {
  regex: /\B!google\s+.+/,
  cb: ({ content }) => {
    const transform = (transformContent) => {
      const query = transformContent.split(' ').map(encodeURIComponent).join('+');
      return `**This query might help you find what you're looking for >** <https://google.com/search?q=${query}>`;
    };

    const query = content.match(/\B!google\s+(.+)/)[1];
    return `${transform(query)}`;
  },
};
registerBotCommand(google.regex, google.cb);

const dab = {
  regex: /(?<!\S)!dab(?!\S)/,
  cb: () => 'https://tenor.com/view/bettywhite-dab-gif-5044603',
};
registerBotCommand(dab.regex, dab.cb);

const motivate = {
  regex: /(?<!\S)!motivate(?!\S)/,
  cb: () => 'Don\'t give up! https://www.youtube.com/watch?v=KxGRhd_iWuE',
};
registerBotCommand(motivate.regex, motivate.cb);

const justDoIt = {
  regex: /(?<!\S)!justdoit(?!\S)/,
  cb: () => 'What are you waiting for?! https://www.youtube.com/watch?v=ZXsQAXx_ao0',
};
registerBotCommand(justDoIt.regex, justDoIt.cb);

module.exports = {
  hug,
  smart,
  lenny,
  fu,
  data,
  google,
  dab,
  motivate,
  justDoIt,
};
