const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('The Odin Project'),
  execute: async (interaction) => {
    await interaction.reply('The Odin Project. Your Career in Web Development Starts Here. <https://www.theodinproject.com> ');
  },
};
