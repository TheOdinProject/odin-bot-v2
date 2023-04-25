const { Events } = require('discord.js');
const { ChannelType } = require('discord-api-types/v10');
const config = require('../config');
const BookmarkMessageService = require('../services/bookmark-message.service');

module.exports = {
  name: Events.MessageReactionAdd,
  execute: (client) => async (reaction, user) => {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
      // If the message this reaction belongs to was removed,
      // the fetching might result in an API error which should be handled
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Something went wrong when fetching the message:', error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }

    // handle DM message reactions
    if (reaction.message.channel.type === ChannelType.DM) {
      // ignore Odin bot's reactions
      if (user.id === client.user.id) return;

      // ignore non Odin bot messages
      if (reaction.message.author.id !== client.user.id) return;

      // delete message
      if (reaction.emoji.name === '❌') {
        reaction.message.delete();
      }

      return;
    }

    // since user argument doesn't have guild roles,
    // we need to get user from guild to check their roles
    const reactionUserAsGuildMember = reaction.message.guild.members.cache.get(
      user.id,
    );
    const isReactionUserNobot = reactionUserAsGuildMember.roles.cache.has(
      config.roles.NOBOTRoleId,
    );

    if (isReactionUserNobot) {
      return;
    }

    if (reaction.emoji.name === '🔖') {
      await BookmarkMessageService.sendBookmarkedMessage(
        reaction.message,
        user,
      );
    }
  },
};
