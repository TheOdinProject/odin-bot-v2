const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bothelp')
    .setDescription('Information about the Odin bot')
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const botHelpEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Odin Bot Information')
      .setDescription(`
**Slash Commands** 
Type a slash \`/\` to see a list of all the available slash commands you can use. Most commands offer extra options, such as pinging a user or specifying additional variables.

**Text-Based Commands** 
We also have these text-based commands which you can use in a sentence:      
\`!xy\`, \`!code\`, \`!question\`, \`!google\`, \`!searchtop\` and \`!top\`

**Bot Playground** 
Experiment with our bot in the [dedicated bot channel](https://discord.com/channels/505093832157691914/513125912070455296) to try out different commands and features. It's a safe space to explore without disturbing the main channels.

**Repository**
Feel free to check out or contribute to the Odin bot's code in the [odin-bot Repository](https://github.com/TheOdinProject/odin-bot-v2)

**Party Parrot** 
Fun fact: Odin-bot loves the Party Parrot! 🦜
      `);

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [botHelpEmbed],
    });
  },
};
