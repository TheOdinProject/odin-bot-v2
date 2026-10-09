const { SlashCommandBuilder } = require('discord.js');
const { randomInt } = require('../../utils/random-int');

const parrots = [
  'https://cultofthepartyparrot.com/parrots/hd/dadparrot.gif',
  'http://cultofthepartyparrot.com/parrots/parrot.gif',
  'http://cultofthepartyparrot.com/parrots/fiestaparrot.gif',
  'http://cultofthepartyparrot.com/parrots/explodyparrot.gif',
  'http://cultofthepartyparrot.com/parrots/slomoparrot.gif',
  'http://cultofthepartyparrot.com/parrots/hd/dealwithitparrot.gif',
  'http://cultofthepartyparrot.com/parrots/tripletsparrot.gif',
  'https://emoji.gg/assets/emoji/6379_vikingparrot.gif',
  'https://emoji.gg/assets/emoji/8201-mr-parrot.gif',
  'https://emoji.gg/assets/emoji/6433_wineparrot.gif',
  'https://emoji.gg/assets/emoji/1085_sleepingparrot.gif',
  'https://emoji.gg/assets/emoji/2282_scienceparrot.gif',
  'https://emoji.gg/assets/emoji/3147_thefastestparrot.gif',
  'https://emoji.gg/assets/emoji/9386_thumbsupparrot.gif',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('partyparrot')
    .setDescription('Summon a party parrot'),
  parrots,
  execute: async (interaction) => {
    await interaction.reply(parrots[randomInt(parrots.length)]);
  },
};
