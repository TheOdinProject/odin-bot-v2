const { RESTJSONErrorCodes } = require('discord-api-types/v10');
const { EmbedBuilder } = require('discord.js');
const ThreadCreator = require('../utils/thread-creator');

class ModerationMessageDeleteService {
  static async handleInteraction(interaction) {
    const message = interaction.options.getMessage('message');

    await ModerationMessageDeleteService.#deleteMessage(message);
    await ModerationMessageDeleteService.#interactionReply(interaction, { content: 'Message deleted.', ephemeral: true });

    if (message.author.bot) return;

    const messageEmbed = await ModerationMessageDeleteService.#messageBuilder(message);

    try {
      await ModerationMessageDeleteService.#sendMessageToUser(
        message.author, { embeds: [messageEmbed] },
      );
    } catch (error) {
      if (error.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) {
        await ModerationMessageDeleteService.#handleThread(message, { embeds: [messageEmbed] });
      } else {
        console.log(error);
      }
    }
  }

  static async #deleteMessage(message) {
    await message.delete();
  }

  static async #interactionReply(interaction, message) {
    await interaction.reply(message);
  }

  static async #sendMessageToUser(user, message) {
    await user.send(message);
  }

  static async #handleThread(message, messageToSend) {
    const { author, guild, channel } = message;
    const threadCreator = ThreadCreator();

    if (channel.isThread()) {
      const parentChannel = await guild.channels.fetch(channel.parentId);
      threadCreator.new({
        channel: parentChannel,
        isPrivate: true,
        name: `Message from ${author.username}`,
        members: [author],
        messages: [messageToSend],
      });
      return;
    }

    threadCreator.new({
      channel,
      isPrivate: true,
      name: `Message from ${author.username}`,
      members: [author],
      messages: [messageToSend],
    });
  }

  static async #messageBuilder(message) {
    return new EmbedBuilder()
      .setTitle('Message Deleted')
      .setDescription(`<@${message.author.id}>, your message was deleted in ${message.channel}`)
      .setFields([
        { name: 'Message:', value: message.content },
      ]);
  }
}

module.exports = ModerationMessageDeleteService;
