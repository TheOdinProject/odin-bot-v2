const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require("discord.js");

const searchSites = {
  google: {
    name: "Google",
    url: "https://www.google.com/search?q=",
  },
  top: {
    name: "TOP",
    url: "https://www.google.com/search?q=site:theodinproject.com+",
  },
  mdn: {
    name: "MDN",
    url: "https://developer.mozilla.org/en-US/search?q=",
  },
};

const createCommand = (site) => (command) =>
  command
    .setName(site.name.toLowerCase())
    .setDescription(`search ${site.name}`)
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("term to search")
        .setRequired(true),
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ping"),
    );

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search in a specific site")
    .addSubcommand(createCommand(searchSites.google))
    .addSubcommand(createCommand(searchSites.mdn))
    .addSubcommand(createCommand(searchSites.top)),
  execute: async (interaction) => {
    const site = searchSites[interaction.options.getSubcommand()];
    const prompt = interaction.options.getString("prompt");

    const linkButton = new ButtonBuilder()
      .setEmoji("🔍")
      .setLabel(`${site.name} results for "${prompt}"`)
      .setURL(`${site.url}${prompt.replaceAll(" ", "+")}`)
      .setStyle(ButtonStyle.Link);

    const actionComponent = new ActionRowBuilder().setComponents(linkButton);

    await interaction.reply({
      components: [actionComponent],
    });
  },
};
