const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {xy} = require('../../commandsContent');

const {color, title, description} = xy;
module.exports = {
  data: new SlashCommandBuilder()
    .setName('xy')
    .setDescription('xy problem article')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const xyEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description);

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [xyEmbed],
    });
  },
};
