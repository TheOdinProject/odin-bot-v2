const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bookmark')
    .setDescription('Info about bookmarking messages in the TOP Discord server'),
  execute: async (interaction) => {
    const bookmarkEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Bookmark messages 🔖')
      .setDescription(`
To bookmark a message, react with the bookmark icon 🔖 on the message you wish to save for later. 

Our bot will then deliver the message to your DMs in an embedded format with a link to the original message in the server. 

You can delete a bookmarked message at any time from your DMs by reacting on it with the ❌ emoji.
      `);

    await interaction.reply({ embeds: [bookmarkEmbed] });
  },
};
