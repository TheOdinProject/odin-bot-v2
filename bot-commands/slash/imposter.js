const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('imposter')
    .setDescription('Dealing with imposter syndrome')
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const stuckEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Dealing with Imposter Syndrome?')
      .setDescription(
        `
Everyone struggles with imposter syndrome when learning programming, so this is a reminder to not compare yourself to anyone else.

Whenever someone shares a project or a specific timeline, remember that this is only a part of the story. There are many factors that can be hidden, such as:

- How much previous experience they have
- If someone else helped
- If any project requirements were skipped

In addition, people struggle with imposter syndrome because they have the expectation that they should know more. However, everyone's learning journey is unique and so everyone will have different knowledge. Instead of expecting yourself to learn everything, just focus on learning the next step in your journey. When you get stuck, ask others around you to help share their knowledge.

Here is an illustration to give you a more realistic view of imposter syndrome:
      `,
      )
      .setImage(
        'https://cdn.statically.io/gh/TheOdinProject/odin-bot-v2/74ec71b88afb52acdf546b2aab3528b5c2b25773/utils/images/imposter.png',
      );

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [stuckEmbed],
    });
  },
};
