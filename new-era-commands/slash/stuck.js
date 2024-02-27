const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { join } = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stuck')
    .setDescription('Flowchart for when stuck')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const stuckImage = new AttachmentBuilder(join(__dirname, 'images/stuck.jpg'));

    const stuckEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('I\'m stuck - what can I do?')
      .setDescription(`
Have a look through the following flowchart (click to enlarge) for guidance in how to approach new concepts and problems. Adopting this process can make problem solving much more productive in the long-term!

If you would like to ask for help, there is a very good question template you can find via the \`/question\` command which can help you include as much relevant context and structure your question in a way that makes it much easier for others to assist you.
      `)
      .setImage('attachment://stuck.jpg');

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [stuckEmbed],
      files: [stuckImage],
    });
  },
};
