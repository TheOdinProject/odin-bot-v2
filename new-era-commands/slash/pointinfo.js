const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('points')
    .setDescription('A guide to points in the TOP Discord server'),
  execute: async (interaction) => {
    const pointsEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Points in the TOP Discord server')
      .setDescription(`
Want to give credit where it's due? Show your appreciation for helpful members in our server by giving them a point! Mention their \`@name\` and add \`++\` or \`:star:\`

**Example:**

\`@username ++\`
\`@username :star:\`

**Club 40:**

Users who have accumulated 40 points will be awarded a special role in recognition of their consistent helpfulness.
For further details about our roles, please refer to [our discord #roles channel](https://discord.com/channels/505093832157691914/936424264180060200)

**Point Inflation:**

Please don't beg for points or abuse the point system.
We will have a strict moderation policy in place which will include losing access to the bot or participation in the points system.

Our goal is to maintain a positive and supportive community, where help and contributions are valued.
      `);

    await interaction.reply({ embeds: [pointsEmbed] });
  },
};
