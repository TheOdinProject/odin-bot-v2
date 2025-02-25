const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bootcamps')
    .setDescription('Info about bootcamps, which we think you should read')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const bootcampEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Bootcamps, be informed!')
      .setDescription(`
Friends don't let friends commit to bootcamps without being informed.

Give this [web archive twitter thread about bootcamps](https://web.archive.org/web/20220410160426/https://twitter.com/lzsthw/status/1212284566431576069) a read to learn more about things to consider and watch out for.
      `);

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [bootcampEmbed],
    });
  },
};
