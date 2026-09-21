const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  chatInputApplicationCommandMention,
} = require('discord.js');
const { color } = require('../../config');

// Skip privileged commands.
function isPublicSlashCommand({ type, default_member_permissions }) {
  const isSlashCommand =
    (type ?? ApplicationCommandType.ChatInput) ===
    ApplicationCommandType.ChatInput;
  return isSlashCommand && default_member_permissions == null;
}

function formatCommandLines(commandsData, commandIds) {
  return commandsData
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .flatMap(({ name, description, options = [] }) => {
      const id = commandIds.get(name);
      const mention = (...names) =>
        id
          ? chatInputApplicationCommandMention(...names, id)
          : `\`/${names.join(' ')}\``;

      const subcommands = options.filter(
        (option) => option.type === ApplicationCommandOptionType.Subcommand,
      );
      if (!subcommands.length) {
        return `${mention(name)} - ${description}`;
      }
      return subcommands.map(
        (subcommand) =>
          `${mention(name, subcommand.name)} - ${subcommand.description}`,
      );
    });
}

async function fetchCommandIds(guild) {
  try {
    const commands = await guild.commands.fetch();
    return new Map(commands.map((command) => [command.name, command.id]));
  } catch (error) {
    console.error(error);
    return new Map();
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botcommands')
    .setDescription('List all of the Odin bot slash commands'),
  execute: async (interaction) => {
    // Required here rather than at the top of the file, as this file is loaded
    // while bot-commands/index.js is still building the list of commands
    const { discordRegistrableCommands } = require('../index');

    const publicCommands = Array.from(discordRegistrableCommands.values())
      .map((command) => command.data.toJSON())
      .filter(isPublicSlashCommand);

    const commandIds = await fetchCommandIds(interaction.guild);
    const lines = formatCommandLines(publicCommands, commandIds);

    const commandsEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle('Odin Bot Commands')
      .setDescription(lines.join('\n'));

    await interaction.reply({
      embeds: [commandsEmbed],
      flags: MessageFlags.Ephemeral,
    });
  },
};
