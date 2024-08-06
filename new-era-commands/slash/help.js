const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

const { channels } = config;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help')
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user');

    // helpEmbed would make a good candidate for a general /help info command (a default command like there is for /points) when we implement subcommands for /help

    const helpEmbed = new EmbedBuilder()
      .setColor('#cc9543')
      .setTitle("Get help on The Odin Project's Discord Server")
      .addFields(
        {
          name: 'Server Conduct',
          value: `All conduct must be within our [rules](https://www.theodinproject.com/guides/community/rules), and [community expectations](https://www.theodinproject.com/guides/community/expectations).\nPlease report issues/misconduct to <@${config.modmailUserId}>, as well as to ask any rule-related questions. Modmail How-To - <#${channels.ContactModeratorsChannelId}>`,
        },
        {
          name: 'Just the FAQs',
          value: `We have a list of frequently asked questions - <#${channels.FAQChannelId}>!`,
        },
        {
          name: 'Helpful bot commands',
          value:
            `Type \` /
            \` in the message box to see the full list of commands! Explore them in our bot channel - <#${channels.botSpamPlaygroundChannelId}>.`,
        },
        {
          name: "It's TOP o'Clock, 24/7/365",
          value:
            "This server is for supporting learners working through our curriculum.\nIf your question is not about TOP's curriculum or the projects it contains, try another discord: [Discord Server Search](https://disboard.org/servers/tag/coding).",
        },
        {
          name: 'TOP is community-driven',
          value:
            'The Odin Project is open source and independent. Donate here: [Open Collective](https://opencollective.com/theodinproject). To learn more, use the `/contribute` or `/support` commands.',
        },
      );

    await interaction.reply({
      content: userId ? `${userId}` : ``,
      embeds: [helpEmbed],
    });
  },
};
