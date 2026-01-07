const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('data')
    .setDescription("Don't ask to ask!")
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const dataEmbed = new EmbedBuilder()
      .setTitle('Don’t ask to ask!')
      .setColor('#cc9543')
      .setURL('https://www.dontasktoask.com/').setDescription(`
Instead of asking if anyone can help you, ask your question outright with as much information as possible so people will know if they can help you.

**Bad**: "Hey, anyone around that is really good with CSS?"

**Good**:
"Hey, I'm having trouble setting CSS styles via Javascript."

**Project/Exercise:**
**Lesson link:**
**Code:** [code sandbox like codepen or replit, or your github repo]
**Issue/Problem:** [screenshots if applicable]
**What I expected:**
**What I've tried:**

**https://www.dontasktoask.com/**
        `);

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [dataEmbed],
    });
  },
};
