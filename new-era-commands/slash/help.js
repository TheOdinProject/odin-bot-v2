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
        "**Reminder:** All conduct must be within our [rules](https://www.theodinproject.com/guides/community/rules), and [community expectations](https://www.theodinproject.com/guides/community/expectations).\nPlease report issues/misconduct to <@575252669443211264>, as well as to ask any rule-related questions. [Modmail How-To](https://discord.com/channels/505093832157691914/1059513837197459547)\n\n **Just the FAQs**\n We have a [list of frequently asked questions](https://discord.com/channels/505093832157691914/823266307293839401/823266549912829992)!\n\n**Helpful bot commands**\nType `/` in the message box to see a list of helpful commands!\n\n**Find the right channel to ask your TOP-related question**\nMake sure you are asking your TOP related question in the best channel. If you are unsure, ask in [odin-general](https://discord.com/channels/505093832157691914/505093832157691916) for where to ask.\n\nIf your question is not about TOP's curriculum or the projects it contains, an appropriate server should be sought out here: [Discord Server Search](https://disboard.org/servers/tag/coding).\n\n**TOP is community driven**\nThe Odin Project relies on open source contributions to our curriculum and is fully financially independent. Donate here: [Open Collective](https://opencollective.com/theodinproject).\n\n To learn more about the ways you can help, use the `/contribute` or `/support` commands in the [bot channel](https://discord.com/channels/505093832157691914/513125912070455296). Thank you!"
      );

    await interaction.reply({
      content: userId ? `${userId}` : ``,
      embeds: [helpEmbed],
    });
  },
};
