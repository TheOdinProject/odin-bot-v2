const { RESTJSONErrorCodes } = require('discord-api-types/v10');
const { EmbedBuilder, MessageFlags } = require('discord.js');
const ThreadCreator = require('../utils/thread-creator');
const { modmailUserId, channels } = require('../config');

class ModerationMessageDeleteService {
  static async handleInteraction(interaction) {
    const message = interaction.options.getMessage('message');

    if (!message || !message.deletable) {
      await ModerationMessageDeleteService.#interactionReply(interaction, {
        content: 'Message cannot be deleted. It may have been deleted already.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await ModerationMessageDeleteService.#deleteMessage(message);

    // For automod or system messages, just delete without notification
    if (message.system || message.author.id === interaction.client.user.id) {
      await ModerationMessageDeleteService.#interactionReply(interaction, {
        content:
          'Automod message deleted. This action did not affect the message that was flagged/blocked by Automod. You would want to use the app-delete command on the message directly to have the message deleted and member notified.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await ModerationMessageDeleteService.#interactionReply(interaction, {
      content: 'Message deleted.',
      flags: MessageFlags.Ephemeral,
    });

    if (message.author.bot) return;

    const messageEmbed =
      await ModerationMessageDeleteService.#messageBuilder(message);

    try {
      await ModerationMessageDeleteService.#sendMessageToUser(message.author, {
        embeds: [messageEmbed],
      });
    } catch (error) {
      if (error.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) {
        await ModerationMessageDeleteService.#handleThread(message, {
          embeds: [messageEmbed],
        });
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
        name: `Deleted Message - ${author.username}`,
        members: [author],
        messages: [messageToSend],
      });
      return;
    }

    threadCreator.new({
      channel,
      isPrivate: true,
      name: `Deleted Message - ${author.username}`,
      members: [author],
      messages: [messageToSend],
    });
  }

  static async #messageBuilder(message) {
    // Get content from either message content or embeds
    let messageContent = message.content;

    // If no content but has embeds, use the embed description
    if (!messageContent && message.embeds?.length > 0) {
      messageContent = message.embeds[0].description || 'Automod Message';
    }

    const embed = new EmbedBuilder().setTitle('Message Deleted').setDescription(
      `
      Hi <@${message.author.id}>, your message in <#${message.channel.id}> was deleted by a moderator.

Some common reasons for post removal include but isn't limited to;
- the post was not in line with our discord rules, channel description or community expectations
- the post didn't follow the specific forum channel guidelines
- the post had downloadable files attached
- a link was shared without context
- the post was shared in multiple channels within a short timeframe (cross-posting)

If further action is deemed necessary, a moderator will follow up on this message in a private thread.

Please make sure to check the rules of the server and the description of the channel you've posted in.
You can find our rules including a link to the additional community expectations here <#${channels.rulesChannelId}>

If after reading the rules, channel description or community expectations, you feel this deletion was made in error, feel free to send a dm to <@${modmailUserId}>`,
    );

    // Only add the field if we have content to show
    if (messageContent?.trim()) {
      embed.setFields([{ name: 'Message:', value: messageContent }]);
    }

    return embed;
  }
}

module.exports = ModerationMessageDeleteService;
