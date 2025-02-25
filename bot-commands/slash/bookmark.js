const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bookmark')
    .setDescription('Info about bookmarking messages in the TOP Discord server')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const bookmarkEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Bookmark messages in this server')
      .setDescription(`
To bookmark a message, react with the bookmark icon 🔖 on the message you wish to save for later.

<@${config.clientId}> will then deliver the message to your DMs in an embedded format with a link to the original message in the server.

You can delete a bookmarked message at any time from your DMs by reacting on it with the ❌ emoji.
      `);

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [bookmarkEmbed],
    });
  },
};
