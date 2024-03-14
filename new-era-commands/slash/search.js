const { ButtonStyle } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

const searchSites = [
  { name: "Google", value: "https://www.google.com/search?q=" },
  {
    name: "TOP",
    value: "https://www.google.com/search?q=site:theodinproject.com+",
  },
  {
    name: "MDN",
    value: "https://developer.mozilla.org/en-US/search?q=",
  },
];

function createSearchSite({ url, prompt }) {
  const { name } = searchSites.find((s) => s.value === url);

  return {
    get description() {
      return `${name} results for "${prompt}"`;
    },
    get searchURL() {
      return `${url}${prompt.replaceAll(" ", "+")}`;
    },
  };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search in a specific site")
    .addStringOption((option) =>
      option
        .setName("site")
        .setDescription("site to search on")
        .setChoices(...searchSites)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("term to search")
        .setRequired(true),
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ping"),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser("user")?.id;
    const site = createSearchSite({
      url: interaction.options.getString("site"),
      prompt: interaction.options.getString("prompt"),
    });

    const linkButton = new ButtonBuilder()
      .setEmoji("🔍")
      .setLabel(site.description)
      .setURL(site.searchURL)
      .setStyle(ButtonStyle.Link);

    const actionComponent = new ActionRowBuilder().setComponents(linkButton);

    await interaction.reply({
      content: userId ? `<@${userId}>` : "",
      components: [actionComponent],
    });
  },
};
