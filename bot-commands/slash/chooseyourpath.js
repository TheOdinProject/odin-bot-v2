const { SlashCommandBuilder } = require('discord.js');

const PATHS = [
  { name: 'Full Stack JavaScript', emoji: '<:node:936642975268749313>' },
  { name: 'Ruby on Rails', emoji: '<:ruby:517023177386491911>' },
];

const QUOTES = [
  (path) =>
    `Thou shalt follow the ${path.name} path. May the force be with thee. :crossed_swords:`,
  (path) =>
    `Diamonds are a girl's best friend, but ${path.name} can be yours! ${path.emoji}`,
  (path) => `It's time to wake up in the mornings with a ${path.name}! ☕ `,
  (
    path,
  ) => `Ah! Another Odinite. I know just what to do with you... ${path.name} 

${path.name}, where dwell the brave at heart

Or yet in wise old ${path.name}, 
if you've a ready mind, 
Where those of wit and learning, 
Will always find their kind.`,
  (path) =>
    `You take the ${path.name} path — you stay in Wonderland, and I show you how deep the rabbit hole goes. Remember: all I'm offering is the truth. Nothing more`,
  () =>
    "Alice: “Would you tell me, please, which way I ought to go from here?” The Cheshire Cat Carlos: “That depends a good deal on where you want to get to.” Alice: “I don't much care where.” The Cheshire Cat Carlos: “Then it doesn't much matter which way you go.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chooseyourpath')
    .setDescription(
      'Let thy fate decide b/w Full Stack JavaScript or Ruby on Rails paths.',
    ),
  execute: async (interaction) => {
    const random = (array) => array[Math.floor(Math.random() * array.length)];
    const chosen = random(QUOTES)(random(PATHS));

    await interaction.reply(chosen);
  },
};
