const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { color } = require('../../config');

const osEmbed = new EmbedBuilder().setColor(color).setTitle('OS support')
  .setDescription(`**The Odin Project is not designed for and does not support Windows or any other OS outside of our recommendations**. We are happy to assist with any questions about installing and using Ubuntu (or an official flavor) via a VM, WSL, or dual booting.

For more info on Windows, check out this exhaustive list on [why we do not support Windows](<https://github.com/TheOdinProject/blog/wiki/Why-We-Do-Not-Support-Windows>).

You can find our list of supported OS options in our [Installation Overview lesson](<https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/installation-overview#os-options>).`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('os')
    .setDescription("Using other OS's")
    .addUserOption((option) =>
      option.setName('user').setDescription('user to ping'),
    ),
  execute: async (interaction) => {
    const userId = interaction.options.getUser('user')?.id;
    await interaction.reply({
      content: userId ? `<@${userId}>` : '',
      embeds: [osEmbed],
    });
  },
  legacy: {
    name: 'os',
    regex: /(?<!\S)!os(?!\S)/,
    cb: () => ({ embeds: [osEmbed] }),
  },
};
