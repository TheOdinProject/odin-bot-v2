const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('Generative AI and Learning to Code')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const aiEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Generative AI and Learning Code')
      .setDescription(
        'Learners should be aware of how generative AI tools can impact their learning.',
      )
      .addFields(
        [
          {
            name: 'Using AI while learning',
            value: 'The Odin Project recommends that learners avoid using generative AI while learning. [You can learn more about this recommendation here.](https://www.theodinproject.com/lessons/foundations-motivation-and-mindset#a-note-on-ai-code-generation)',
            inline: true,
          },
          {
            name: 'Chat about AI',
            value: 'There is a [thread for discussions about AI tools](https://discord.com/channels/505093832157691914/1050497328915697664), so please chat there about these types of tools.',
            inline: true,
          },
        ],
      );

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [aiEmbed],
    });
  },
};
