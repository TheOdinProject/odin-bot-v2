const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stuck')
    .setDescription('Flowchart for when stuck')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const stuckEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('I\'m stuck - what can I do?')
      .setDescription(`
Have a look through the following flowchart (click to enlarge) for guidance in how to approach new concepts and problems. Adopting this process can make problem solving much more productive in the long-term!

If you would like to ask for help, there is a very good question template you can find via the \`/question\` command which can help you include as much relevant context and structure your question in a way that makes it much easier for others to assist you.
      `)
      .setImage(
        'https://cdn.statically.io/gh/TheOdinProject/odin-bot-v2/03c97a193c751d1cdffa81c3d3bf84e00291cd26/new-era-commands/slash/images/stuck.jpg'
      );

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [stuckEmbed],
    });
  },
};
