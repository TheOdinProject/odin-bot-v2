const { Events } = require('discord.js');
const GettingHiredMessageService = require('../services/getting-hired-message.service');
const config = require('../config');
const { isAdmin } = require('../utils/is-admin');

const botCommands = [];

let authorBuffer = [];

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
          const response = await fn();
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
