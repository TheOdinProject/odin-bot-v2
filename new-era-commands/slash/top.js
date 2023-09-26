const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Information about The Odin Project')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const topEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('The Odin Project')
      .setDescription(`
For more information about The Odin Project, visit our site:
[Your Career in Web Development Starts Here](https://www.theodinproject.com/)
    `);

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [topEmbed],
    });
  },
};
