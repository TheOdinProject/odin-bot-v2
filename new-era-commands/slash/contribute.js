const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('contribute')
    .setDescription('Information on how to contribute to TOP on GitHub'),
  execute: async (interaction) => {
    const contributingEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Contributing to The Odin Project Repositories')
      .setURL('https://github.com/TheOdinProject')
      .setDescription(`
**How to contribute**

To contribute to The Odin Project, check out our repositories on GitHub:

• [TOP curriculum repository](https://github.com/TheOdinProject/curriculum)
• [TOP main website repository](https://github.com/TheOdinProject/theodinproject)
• [TOP odin-bot Repository](https://github.com/TheOdinProject/odin-bot-v2)

Make sure to read the [contributing guide](https://github.com/TheOdinProject/.github/blob/main/CONTRIBUTING.md) before getting started.

To find issues ready to be worked on, go to the \`issues\` tab in each repository. You can also create new issues or propose suggestions there. 

**First time contributors**

If you're a first-time contributor, you can look for issues labeled \`good first issue\`. 
These are beginner-friendly and perfect for getting started with open source contributions.

**Top-contributors role**

You will recognize our TOP-Contributors by their special role which you can learn more about in our [#roles](https://discord.com/channels/505093832157691914/936424264180060200) channel.

We hope to see you on GitHub!
      `);

    await interaction.reply({ embeds: [contributingEmbed] });
  },
};
