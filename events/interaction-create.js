const { Events, MessageFlags } = require('discord.js');
const { discordRegistrableCommands } = require('../bot-commands');
const FormatCodeService = require('../services/format-code');

module.exports = {
  name: Events.InteractionCreate,
  execute: () => async (interaction) => {
    if (interaction.isCommand()) {
      const command = discordRegistrableCommands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral
        });
      }
    }

    if (interaction.isModalSubmit()) {
      try {
        if (interaction.customId === FormatCodeService.modalId) {
          await FormatCodeService.handleModalSubmit(interaction);
          return;
        }
        interaction.reply({ content: 'Unknown modal submit', flags: MessageFlags.Ephemeral });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
