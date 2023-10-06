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
        "**Server Conduct**\nAll conduct must be within our [rules](https://www.theodinproject.com/guides/community/rules), and [community expectations](https://www.theodinproject.com/guides/community/expectations).\nPlease report issues/misconduct to <@575252669443211264>, as well as to ask any rule-related questions. [Modmail How-To](https://discord.com/channels/505093832157691914/1059513837197459547)\n\n **Just the FAQs**\n We have a [list of frequently asked questions](https://discord.com/channels/505093832157691914/823266307293839401/823266549912829992)!\n\n**Helpful bot commands**\nType `/` in the message box to see the full list of commands! Explore them in our [bot channel](https://discord.com/channels/505093832157691914/513125912070455296). \n\n**It's TOP o'Clock, 24/7/365**\n This server is for supporting learners working through our curriculum.\nIf your question is not about TOP's curriculum or the projects it contains, try another discord: [Discord Server Search](https://disboard.org/servers/tag/coding).\n\n**TOP is community-driven**\nThe Odin Project is open source and independent. Donate here: [Open Collective](https://opencollective.com/theodinproject). To learn more, use the `/contribute` or `/support` commands."
      );

    await interaction.reply({
      content: userId ? `${userId}` : ``,
      embeds: [helpEmbed],
    });
  },
};
