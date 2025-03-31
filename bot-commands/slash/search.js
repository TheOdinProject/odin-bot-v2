const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require('discord.js');

const searchSites = new Map()
  .set('google', {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    description: 'Search for terms in Google',
  })
  .set('top', {
    name: 'TOP',
    url: 'https://www.google.com/search?q=site:theodinproject.com+',
    description: 'Search for terms in The Odin Project website with Google',
  })
  .set('mdn', {
    name: 'MDN',
    url: 'https://developer.mozilla.org/en-US/search?q=',
    description: 'Search for terms in MDN',
  });

const slashCommand = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search in a specific site');

searchSites.forEach((site) =>
  slashCommand.addSubcommand((command) =>
    command
      .setName(site.name.toLowerCase())
      .setDescription(site.description)
      .addStringOption((option) =>
        option
          .setName('prompt')
          .setDescription('term to search')
          .setRequired(true),
      )
      .addUserOption((option) =>
        option.setName('user').setDescription('user to ping'),
      ),
  ),
);

module.exports = {
  data: slashCommand,
  execute: async (interaction) => {
    const siteName = interaction.options.getSubcommand();
    const userId = interaction.options.getUser('user');
    const prompt = interaction.options.getString('prompt');

    const site = searchSites.get(siteName);

    const linkButton = new ButtonBuilder()
      .setEmoji('🔍')
      .setLabel(`${site.name}'s search results for "${prompt}"`)
      .setURL(`${site.url}${encodeURIComponent(prompt)}`)
      .setStyle(ButtonStyle.Link);

    const actionComponent = new ActionRowBuilder().setComponents(linkButton);

    await interaction.reply({
      content: userId && `${userId}`,
      components: [actionComponent],
    });
  },
};
