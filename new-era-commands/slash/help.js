const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ping")
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser("user");

    // helpEmbed would make a good candidate for a general /help info command (a default command like there is for /points) when we implement subcommands for /help

    const helpEmbed = new EmbedBuilder()
      .setColor("#cc9543")
      .setTitle("Get help on The Odin Project's Discord Server")
      .setDescription(
        "**Reminder:** All conduct must be within our [rules](https://www.theodinproject.com/guides/community/rules), and [community expectations](https://www.theodinproject.com/guides/community/expectations).\nPlease report issues/misconduct to <@575252669443211264>, as well as to ask any rule-related questions. [Modmail How-To](https://discord.com/channels/505093832157691914/1059513837197459547)"
      )
      .addFields([
        {
          name: "Just the FAQ's, please",
          value:
            "We have a [list of frequently asked questions](https://discord.com/channels/505093832157691914/823266307293839401/823266549912829992)!",
        },
      ])
      .addFields([
        {
          name: "Helpful bot commands",
          value:
            "Type `/` in the message box to see the list of all the *helpful & informative commands!* \n\n Particularly helpful commands for newer learners:\n`/rules`, `/faq`, `/bookmark`, `/time`, `/code`, `/data`, `/question`, `/searchtop`, `/ai`, `/research`, `/memory`, `/notes`, `/portfolio`, and `/windows`.",

          // remember to remove reference to windows when WSL2 is adopted
        },
      ])

      .addFields([
        {
          name: "Find the right channel to ask your TOP-related question",
          value:
            "Make sure you are asking your TOP related question in the best channel. If you are unsure, ask in [odin-general](https://discord.com/channels/505093832157691914/505093832157691916) for where to ask.\n\nIf your question is not about TOP's curriculum or the projects it contains, an appropriate server should be sought out here: [Discord Server Search](https://disboard.org/servers/tag/coding).",
        },
      ])
      .addFields([
        {
          name: "TOP is community driven",
          value:
            "The Odin Project relies on open source contributions to our curriculum and is fully financially independent. Donate here: [Open Collective](https://opencollective.com/theodinproject).\n\n We **truly** appreciate all those (past/present/future) who volunteer their time and expertise to help their fellow learners, as well as those able to make financial contributions to support The Odin Project!\n\nTo learn more about the ways you can help, use the `/contribute` or `/support` commands in the [bot channel](https://discord.com/channels/505093832157691914/513125912070455296). Thank you!",
        },
      ]);

    await interaction.reply({
      content: userId ? `${userId}` : ``,
      embeds: [helpEmbed],
    });
  },
};
