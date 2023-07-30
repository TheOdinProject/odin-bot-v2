const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('points')
    .setDescription('Points'),
  execute: async (interaction) => {
    const pointsEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Points in the TOP Discord server')
      .setDescription(`
        If you consider someone helpful in our server, you can give them a point by mentioning their \`@name\` and adding \`++\` or \`:star:\`
        
        **Examples:**

        \`@username ++\`
        \`@username :star:\`
      
        **Club 40:**

        Users who have amassed 40 points get a special role for having been helpful many times.
        You can find more about our roles in [our discord #roles channel](https://discord.com/channels/505093832157691914/936424264180060200)
      `);

    await interaction.reply({ embeds: [pointsEmbed] });
  },
};
