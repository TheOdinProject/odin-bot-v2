const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('Information on why it\'s near impossible to tell how long TOP will take')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;
    const timeEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Time is an illusion')
      .setDescription(
        'Please read this [Discord message to learn more about time expectations](https://discord.com/channels/505093832157691914/505093832157691916/765633002393829389)',
      );
    await interaction.reply({
      content: userId ? `<@${userId}>` : '',
      embeds: [timeEmbed],
    });
  },
};
