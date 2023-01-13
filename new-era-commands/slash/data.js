const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('data')
    .setDescription("Don't ask to ask!"),
  execute: async (interaction) => {
    const dataEmbed = new EmbedBuilder()
      .setTitle('Don’t ask to ask!')
      .setColor('#cc9543')
      .setURL('https://www.dontasktoask.com/')
      .setDescription(`
Instead of asking if anyone can help you, ask your question outright so people can help you!

**Bad**: "Hey, does anyone know how to set CSS styles with Javascript?"

**Good**:
"Hey, I'm having trouble setting CSS styles via Javascript.

Here's my code:
\`\`\`Code snippet\`\`\`\

And here is the error I'm receiving:
\`Cannot set attribute 'style' of null\` "

**https://www.dontasktoask.com/**
        `);

    await interaction.reply({ embeds: [dataEmbed] });
  },
};
