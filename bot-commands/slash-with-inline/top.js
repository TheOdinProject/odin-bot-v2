const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { color } = require('../../config');

const topEmbed = new EmbedBuilder()
  .setColor(color)
  .setTitle('The Odin Project')
  .setDescription(
    'For more information about The Odin Project, visit our site:\n[Your Career in Web Development Starts Here](https://www.theodinproject.com/)',
  );

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Information about The Odin Project')
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [topEmbed],
    });
  },
  legacy: {
    name: 'top',
    regex: /(?<!\S)!top(?!\S)/,
    cb: () => ({ embeds: [topEmbed] }),
  },
};
