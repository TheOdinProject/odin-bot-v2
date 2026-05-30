const { Events } = require('discord.js');
const GettingHiredMessageService = require('../services/getting-hired-message.service');
const config = require('../config');
const { isAdmin } = require('../utils/is-admin');
const SpamKickingService = require('../services/spam-kick/spammer-kick-service');

const botCommands = [];

let authorBuffer = [];

const WARN_EXPIRY_MS = 24 * 60 * 60 * 1000;
const warnedSpammers = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [userId, warnedAt] of warnedSpammers) {
    if (now - warnedAt >= WARN_EXPIRY_MS) {
      warnedSpammers.delete(userId);
    }
  }
}, WARN_EXPIRY_MS);

let currentIntroductionsMessage = null;

const introductionsWelcomeMessage = `Welcome to The Odin Project! Take a moment to survey all of the channels on the sidebar, especially the <#${config.channels.FAQChannelId}> channel for answers to commonly asked questions. We're excited for you to join us on your programming journey. Happy learning!`;

function createAuthorEntry(message) {
  const entry = {
    author: message.author.id,
    timeOut: false,
  };

  setTimeout(() => {
    entry.timeOut = true;
  }, 60000);

  return entry;
}

function flushAuthorEntries() {
  authorBuffer = authorBuffer.filter((entry) => entry.timeOut === false);
}

function registerBotCommand(regex, fn) {
  botCommands.push({ regex, fn });
}

module.exports = {
  name: Events.MessageCreate,
  registerBotCommand,
  execute: (client) => async (message) => {
    // Prevent bot from responding to its own messages
    if (message.author === client.user) {
      return;
    }

    /**
     * Some bot behavior (such as responding to #introductions messages) executes
     * based on the admin (core, maintainer) status of the member in the Discord.
     * Sets the flag for later use.
     */

    const isAdminMessage = isAdmin(message.member);

    // Kick people who posts more than 4 attachments
    if (!isAdminMessage && message.attachments.size >= 4) {
      try {
        // Deleting a message that has been already deleted by other bots will throw an error, we ignore it in that case
        await message.delete();
        // eslint-disable-next-line no-empty
      } catch {}

      const warnedAt = warnedSpammers.get(message.author.id);
      const isActive = warnedAt && Date.now() - warnedAt < WARN_EXPIRY_MS;

      if (isActive) {
        SpamKickingService.kick(message.member);
      } else {
        warnedSpammers.set(message.author.id, Date.now());
        SpamKickingService.warn(message.member);
      }
      return;
    }

    const isMessageAuthorNobot = message.member?.roles.cache.has(
      config.roles.NOBOTRoleId,
    );

    // can't bot if user is NOBOT
    if (isMessageAuthorNobot) {
      return;
    }

    const authorEntryCount = authorBuffer.reduce((count, current) => {
      if (current.author === message.author.id) {
        return count + 1;
      }
      return count;
    }, 0);

    flushAuthorEntries();

    if (authorEntryCount > 10) {
      console.log('DENIED');
      return;
    }

    botCommands.forEach(async ({ regex, fn }) => {
      if (process.argv.includes('dev') && message.channel.type !== 'dm') {
        return;
      }
      if (message.content.toLowerCase().match(regex)) {
        authorBuffer.push(createAuthorEntry(message));
        try {
          // Don't be an idiot like me and remove the callback's message arg
          // Even if none of the ! commands use it, award-points does.
          // - Mao
          const response = await fn(message);
          if (response) {
            try {
              if (Array.isArray(response)) {
                response.forEach((element) => {
                  if (element !== undefined) {
                    message.channel.send(element);
                  }
                });
              } else {
                message.channel.send(response);
              }
            } catch (e) {
              console.log(e);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    });

    if (message.channel.id === config.channels.gettingHiredChannelId) {
      const gettingHiredMessageService = new GettingHiredMessageService();
      await gettingHiredMessageService.handleMessage(message, isAdminMessage);

      return;
    }

    if (message.channel.id === config.channels.introductionsChannelId) {
      // introductions
      if (!isAdminMessage) {
        if (
          currentIntroductionsMessage &&
          currentIntroductionsMessage.content === introductionsWelcomeMessage
        ) {
          currentIntroductionsMessage.delete();
        }
        currentIntroductionsMessage = await message.channel.send(
          introductionsWelcomeMessage,
        );
      }
    }
  },
};
