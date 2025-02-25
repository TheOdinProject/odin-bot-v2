const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { color } = require('../../config');

const questionEmbed = new EmbedBuilder()
  .setColor(color)
  .setTitle('Asking Great Questions').setDescription(`
Asking context-rich questions makes it easy to receive help, and makes it easy for others to help you quickly! Great engineers ask great questions, and the prompt below is an invitation to improve your skills and set yourself up for success in the workplace.

**Project/Exercise:**
**Lesson link:**
**Code:** [code sandbox like replit or codepen]
**Issue/Problem:** [screenshots if applicable]
**What I expected:**
**What I've tried:**

For more information, read our [guide on honing your question-asking skills](<https://www.theodinproject.com/guides/community/how_to_ask>).
        `);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('question')
    .setDescription('Asking Great Questions')
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [questionEmbed],
    });
  },
  legacy: {
    regex: /(?<!\S)!question(?!\S)/,
    cb: () => {
      return { embeds: [questionEmbed] };
    },
  },
};
