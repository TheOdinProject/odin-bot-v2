const { MessageEmbed } = require('discord.js');

class BookmarkMessageService {
  static async sendBookmarkedMessage(message, user) {
    const messageEmbed = BookmarkMessageService.#createMessageEmbed(message, user);

    try {
      await BookmarkMessageService.#sendToUser(user, { embeds: [messageEmbed] });
    } catch (error) {
      if (error.name === 'DiscordAPIError') {
        const botSpamPlaygroundChannelId = '513125912070455296';
        const botSpamChannel = message.guild.channels.cache.get(botSpamPlaygroundChannelId);
        await BookmarkMessageService.#sendToChannel(botSpamChannel, { content: `${user}, turn on replies from server members in Discord settings to receive bookmarks in your DM.`, embeds: [messageEmbed] });
      } else {
        console.log(error);
      }
    }
  }

  static #createMessageEmbed(message, user) {
    return new MessageEmbed().setColor('#cc9543')
      .setAuthor({ name: user.username + user.discriminator, iconURL: user.displayAvatarURL() })
      .setDescription(`
    ${message.content}
    
    ${message.url}
    `);
  }

  static async #sendToUser(user, message) {
    await user.send(message);
  }

  static async #sendToChannel(channel, message) {
    await channel.send(message);
  }
}

module.exports = BookmarkMessageService;
