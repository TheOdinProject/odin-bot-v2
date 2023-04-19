const { EmbedBuilder } = require('discord.js');
const { RESTJSONErrorCodes } = require('discord-api-types/v10');
const config = require('../config');

class BookmarkMessageService {
  static async sendBookmarkedMessage(message, user) {
    const messageEmbed = BookmarkMessageService.#createMessageEmbed(message);

    try {
      await BookmarkMessageService.#sendToUser(user, { embeds: [messageEmbed] });
    } catch (error) {
      if (error.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) {
        const botSpamChannel = message.guild.channels.cache.get(
          config.channels.botSpamPlaygroundChannelId,
        );
        await BookmarkMessageService.#sendToChannel(botSpamChannel, { content: `${user}, turn on replies from server members in Discord settings to receive bookmarks in your DM.` });
      } else {
        console.log(error);
      }
    }
  }

  static #createMessageEmbed(message) {
    const { author, content, url } = message;

    return new EmbedBuilder().setColor('#cc9543')
      .setAuthor({
        name: author.username + author.discriminator,
        iconURL: author.displayAvatarURL(),
      })
      .setDescription(`
    ${content}
    
    [Original Message](${url})
    `)
      .setFooter({ text: 'React with ❌ to delete Odin bot messages.' });
  }

  static async #sendToUser(user, message) {
    await user.send(message);
  }

  static async #sendToChannel(channel, message) {
    await channel.send(message);
  }
}

module.exports = BookmarkMessageService;
