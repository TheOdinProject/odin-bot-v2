const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tutorialhell')
    .setDescription("TOP's advice on doing more than one course at a time")
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');
    const tutorialHellEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle("TOP's advice on doing more than one course at a time")
      .setDescription(`
1. There is no "best" course when you're a self-learner. It's about learning yourself and not being handed the concepts.
2. Beginner content dominates learning resources, but excessive topic repetition, known as "Tutorial Hell", isn't helpful. Instead, focus on practice and progress. Concepts often become clearer over time. Using multiple courses simultaneously prolongs basic learning, by lacking the understanding to integrate the concepts fully. This wastes time. Switching courses can lead to context loss and increased repetition, further slowing you down. After learning, reinforce with practice, not mere topic reiteration.
3. Different courses, different methods. Mixing them can confuse you and scatter your attention. This could extend your learning time or leave you with shallow knowledge. Following one course eliminates this.
4. Finding help on topics in courses with a weak support community is difficult, and shifting this burden to another is rude and unlikely to be helpful.
5. Undecided? Pick the course you feel you are most likely to complete.
      `);
    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [tutorialHellEmbed],
    });
  },
};
