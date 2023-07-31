const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('contribute')
    .setDescription('Information on how to contribute to TOP on GitHub'),
  execute: async (interaction) => {
    const debugEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('Contributing to The Odin Project Repositories')
      .setURL('https://www.theodinproject.com/contributing')
      .setDescription(`

        You too can contribute to our repositories on GitHub! Whether you've spotted a way to enhance our content or encountered a bug, your contributions are priceless! 
        
        If you are familiar with forking, cloning, and opening a pull request, you should be ready to make your (first) open-source contributions.

        **TOP Contributing Guide**
        To learn more about how to contribute, [you can find our contributing guide here](https://github.com/TheOdinProject/.github/blob/main/CONTRIBUTING.md).

        **Open Issues**
        On each of the repositories shared below, you can find a tab called \`issues\` where you will see all open issues for the repository. 

        **First Contributors**
        Open issues marked as \`good first issue\` will often be a great first issue to pick up. Follow this link [to see the curriculum's good first issues](https://github.com/TheOdinProject/curriculum/issues?q=is%3Aissue+is%3Aopen+label%3A%22Type%3A+Good+First+Issue%22).
        You can comment on an issue if you wish to be assigned.
        \u200b
      `)
      .addFields(
        [{
          name: 'TOP Curriculum',
          value: '[The TOP curriculum repo](https://github.com/TheOdinProject/curriculum) contains the lessons and projects on the website. Here you can add lesson content, resources and work on open issues. You can also make suggestions or open an issue of your own.',
          inline: true,
        },
        {
          name: 'TOP Main Website',
          value: '[The TOP main website repo](https://github.com/TheOdinProject/theodinproject) is a Ruby on Rails application. Here you can contribute towards website features, bugs or open your own issue for features, suggestions or bugs you\'ve encountered.',
          inline: true,
        },
        {
          name: 'Odin Bot',
          value: '[The Odin bot](https://github.com/TheOdinProject/odin-bot-v2) is also open source, as a cherished member of our server our bot surely appreciates the love and care you put into making it even better.',
          inline: true,
        },
        {
          name: 'Contribution Opportunities',
          value: 'Keep an eye on our [#contribution-opportunities channel](https://discord.com/channels/505093832157691914/700355756188368926) to see if we have posted any open issues that could use some help.',
          inline: true,
        },
        {
          name: 'TOP Contributors',
          value: 'You may encounter someone with the role of top-contributor in this server. This is a role to recognize users who have made numerous contributions to our public repositories. To learn more about this role, head over to [our #roles channel](936424264180060200)',
          inline: true,
        },
        ],
      );

    await interaction.reply({ embeds: [debugEmbed] });
  },
};
