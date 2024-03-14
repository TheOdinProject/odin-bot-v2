const { ActionRowBuilder } = require("discord.js");
const { ButtonBuilder } = require("discord.js");
const { ButtonStyle, SlashCommandBuilder } = require("discord.js");

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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search in a specific site")
    .addSubcommand((command) =>
      command
        .setName("google")
        .setDescription("search Google")
        .addStringOption((option) =>
          option
            .setName("prompt")
            .setDescription("term to search")
            .setRequired(true),
        )
        .addUserOption((option) =>
          option.setName("user").setDescription("user to ping"),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("top")
        .setDescription("search TOP")
        .addStringOption((option) =>
          option
            .setName("prompt")
            .setDescription("term to search")
            .setRequired(true),
        )
        .addUserOption((option) =>
          option.setName("user").setDescription("user to ping"),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("mdn")
        .setDescription("search MDN")
        .addStringOption((option) =>
          option
            .setName("prompt")
            .setDescription("term to search")
            .setRequired(true),
        )
        .addUserOption((option) =>
          option.setName("user").setDescription("user to ping"),
        ),
    ),
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
