const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('research')
    .setDescription("Our stance on doing your own research and asking questions")
    .addUserOption((option) => option.setName('user').setDescription('user to ping')),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const dataEmbed = new EmbedBuilder()
      .setTitle('Asking questions in the TOP Discord')
      .setColor('#cc9543')
      .setDescription(`
"Here's my take on asking questions here:

Naturally, we welcome them. But we will hold you accountable when you ask a question that is easily researched. Not because we think you're a jerk. But because independent research is so critical to your continued learning.

Imagine you are on your first job and you went to your lead dev for questions every few minutes. I'm sure they'd be happy to help but a better situation is if you do some initial research on your own then take what you've found to your lead if you still have questions.

That's a very different conversation from: *"Hey, I have no idea about this. Please tell me everything."*

vs

*"So I did some research. This is what I understand. And this is what I don't understand. Can you help clarify this last bit?"*

So yeah, feel free to continue to ask. But make sure you are doing your part by doing the research. This helps all of us grow.",
       `)

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [dataEmbed],
    });
  },
};
