const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help'),
  execute: async (interaction) => {
    const helpEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Help')
      .setDescription('**By posting in this chatroom you agree to our [rules](https://www.theodinproject.com/community_rules)** and our **[community expectations](https://www.theodinproject.com/community_expectations)**.')
      .addFields([
        {
          name: 'Add Points',
          value: 'Give points to someone who has been helpful by mentioning their name \n and adding ++ : \n `@username ++` or by \n giving them a star : `@username :star:`.',
          inline: true,
        },
        {
          name: 'Leaderboard',
          value: 'View the points leaderboard with `!leaderboard`. \n\n Modify it with `n=` and `start=` i.e. `!leaderboard n=25 start=30`.',
          inline: true,
        },
        {
          name: 'Contribute to the bot',
          value: '<https://github.com/TheOdinProject/odin-bot-v2>',
          inline: true,
        },
      ]);

    await interaction.reply({ embeds: [helpEmbed] });
  },
};
