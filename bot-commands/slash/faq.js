const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { channels } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Provides a link to our FAQ channel')
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const faqEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('TOP FAQ')
      .setDescription(
        `We have a channel with frequently asked questions - <#${channels.FAQChannelId}>!`,
      );

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [faqEmbed],
    });
  },
};
