const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('Generative AI and Learning to Code')
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const aiEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Generative AI and Learning to Code')
      .addFields([
        {
          name: 'AI Etiquette',
          value:
            'Do not ask for help debugging code created by or with the help of AI tools. Requests to verify or examine the accuracy of AI-generated content (including code) are not permitted.',
          inline: true,
        },
        {
          name: 'Using AI while learning',
          value:
            'For a more productive journey, The Odin Project recommends that learners [avoid using generative AI while learning](https://www.theodinproject.com/lessons/foundations-motivation-and-mindset#a-note-on-ai-code-generation).',
          inline: true,
        },
        {
          name: 'Chat about AI',
          value:
            'There is a [thread for discussions about AI tools](https://discord.com/channels/505093832157691914/1050497328915697664), so please chat there about these types of tools.',
          inline: true,
        },
      ]);

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [aiEmbed],
    });
  },
};
