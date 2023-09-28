const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Provides a link to our FAQ channel')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const faqEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Our TOP Discord FAQ')
      .setDescription(`
*The definition of insanity is answering the same question over and over again.*

We have a [channel with frequently asked questions](https://discord.com/channels/505093832157691914/823266307293839401/823266549912829992)!
Help us stay sane by giving it a read.
      `);
    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [faqEmbed],
    });
  },
};
