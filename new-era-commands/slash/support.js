const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Support The Odin Project'),
  execute: async (interaction) => {
    const learnMoreButton = new ButtonBuilder()
      .setLabel('Learn More')
      .setURL('https://theodinproject.com/support_us')
      .setStyle(ButtonStyle.Link)
      .setEmoji('📖');
    const donateNowButton = new ButtonBuilder()
      .setLabel('Donate Now')
      .setURL('https://opencollective.com/theodinproject/donate?amount=5')
      .setStyle(ButtonStyle.Link)
      .setEmoji('1270559118368964710');

    const buttons = new ActionRowBuilder().addComponents(
      learnMoreButton,
      donateNowButton,
    );

    const supportEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Support The Project')
      .setDescription(
        'From the very beginning, The Odin Project has been committed to providing a world-class and completely free coding curriculum for anyone and everyone eager to learn. **With your generous donations**, we can continue to inspire thousands of aspiring developers, irrespective of their background or financial status.',
      );

    await interaction.reply({ embeds: [supportEmbed], components: [buttons] });
  },
};
