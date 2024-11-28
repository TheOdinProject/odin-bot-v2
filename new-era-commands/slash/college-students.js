const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('college-students')
    .setDescription(
      'College/University students seeking career advice, internship advice, and course planning',
    )
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    const collegeStudentEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle(
        'College/University students seeking career advice, internship advice, and course planning:',
      )
      .setDescription(' ')
      .addFields([
        {
          name: 'Career Counselors, Academic Advisors, and Professors:',
          value: `- Career counselors have data on successful students' paths (resumes, GPA, coursework, activities) specific to your school/major. They know what students are doing to get hired. \n - Career counselors are aware of school-specific and major-specific internships and networking opportunities like connections to alumni who are in the field. \n - Career counselors maintain direct relationships with companies that hire from your school and know exactly what they want. They have meetings with hiring managers and get feedback/insight from those hiring managers that they can pass along to you.\n - Academic Advisors and Professors understand the majors and courses available to you. We can only guess.`,
          inline: false,
        },
        {
          name: 'Your tuition pays for those valuable resources - use them!',
          value: `- Career counselors, academic advisors, and professors are paid professionals whose job is to guide students like you to success. Your tuition already pays for this premium support team. Meanwhile, 99.73% of people here are learning programming fundamentals and won't have context on your courses, your school, your major, or opportunities available to you. The staff at your school have all that.`,
          inline: false,
        },
      ]);

    await interaction.reply({
      content: userId ? `${userId}` : '',
      embeds: [collegeStudentEmbed],
    });
  },
};


