const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('callbacks')
    .setDescription('Article about callbacks')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const cbEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Did someone say CALLBACKS?!')
      .setDescription(`
[This article about callbacks](https://briggs.dev/blog/understanding-callbacks) has helped many people already. We suggest you give it a read!
      `);

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [cbEmbed],
    });
  },
};
