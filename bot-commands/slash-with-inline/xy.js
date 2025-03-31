const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { color } = require('../../config');

const xyEmbed = new EmbedBuilder()
  .setColor(color)
  .setTitle('This could very well be an xy problem')
  .setDescription(
    'What problem are you *really* trying to solve? Check out [this article about xy problems](https://xyproblem.info/) to help others better understand your question.',
  );

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xy')
    .setDescription('xy problem article')
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [xyEmbed],
    });
  },
  legacy: {
    name: 'xy',
    regex: /(?<!\S)!xy(?!\S)/,
    cb: () => ({ embeds: [xyEmbed] }),
  },
};
