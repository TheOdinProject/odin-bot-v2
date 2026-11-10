const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require('discord.js');
const BookmarkMessageService = require('../../services/bookmark-message.service');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Bookmark message')
    .setType(ApplicationCommandType.Message),
  execute: async (interaction) => {
    await BookmarkMessageService.sendBookmarkedMessage(
      interaction.targetMessage,
      interaction.user,
    );

    // Bot replies currently handled in service file
    // and are not interaction-based due to also working with the :bookmark: reaction event.
    // No interaction.end() method to silently complete the interaction
    // so this is the next best way for now.
    // Replies can be made interaction-based if we remove the :bookmark: reaction trigger.
    await interaction.deferReply();
    await interaction.deleteReply();
  },
};
