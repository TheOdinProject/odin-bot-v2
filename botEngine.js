const { ChannelType } = require('discord-api-types/v10');
const BookmarkMessageService = require('./services/bookmark-message.service');
const GettingHiredMessageService = require('./services/getting-hired-message.service');
const newEraCommands = require('./new-era-commands');
const FormatCodeService = require('./services/format-code');
const config = require('./config');

const botCommands = [];

let authorBuffer = [];

let currentIntroductionsMessage = null;
const introductionsWelcomeMessage = 'Welcome to The Odin Project! Take a moment to survey all of the channels on the sidebar, especially the <#823266307293839401> channel for answers to commonly asked questions. We\'re excited for you to join us on your programming journey. Happy learning!';

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

async function listenToMessages(client) {
  const gettingHiredMessageService = new GettingHiredMessageService();

  client.on('messageCreate', async (message) => {
    // Prevent bot from responding to its own messages
    if (message.author === client.user) {
      return;
    }

    /**
     * Some bot behavior (such as responding to #introductions messages) executes
     * based on the admin (core, maintainer) status of the member in the Discord.
     * Sets the flag for later use.
     */
    let isAdminMessage = false;
    try {
      isAdminMessage = message.member.roles.cache
        .some((r) => config.roles.adminRolesName.includes(r.name));
    } catch (e) {
      //  The only 'con' is a command or message gets ignored.
    }

    let isMessageAuthorNobot = false;
    try {
      isMessageAuthorNobot = message.member.roles.cache.has(config.roles.NOBOTRoleId);
    } catch (err) {
      // message.member can be null
    }

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
      await gettingHiredMessageService.handleMessage(message, isAdminMessage);

      return;
    }

    if (message.channel.id === config.channels.introductionsChannelId) { // introductions
      if (!isAdminMessage) {
        if (
          currentIntroductionsMessage
          && currentIntroductionsMessage.content === introductionsWelcomeMessage
        ) {
          currentIntroductionsMessage.delete();
        }
        currentIntroductionsMessage = await message.channel.send(introductionsWelcomeMessage);
      }
    }
  });
}

async function listenToReactions(client) {
  client.on('messageReactionAdd', async (reaction, user) => {
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
    const reactionUserAsGuildMember = reaction.message.guild.members.cache.get(user.id);
    const isReactionUserNobot = reactionUserAsGuildMember.roles.cache.has(config.roles.NOBOTRoleId);

    if (isReactionUserNobot) {
      return;
    }

    if (reaction.emoji.name === '🔖') {
      await BookmarkMessageService.sendBookmarkedMessage(reaction.message, user);
    }
  });
}

async function listenToInteractions(client) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = newEraCommands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply(
        { content: 'There was an error while executing this command!', ephemeral: true },
      );
    }
  });
}

async function listenToModalSubmits(client) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    try {
      if (interaction.customId === FormatCodeService.modalId) {
        await FormatCodeService.handleModalSubmit(interaction);
        return;
      }
      interaction.reply({ content: 'Unknown modal submit', ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply(
        { content: 'There was an error while executing this command!', ephemeral: true },
      );
    }
  });
}

module.exports = {
  listenToMessages,
  listenToReactions,
  listenToInteractions,
  listenToModalSubmits,
  registerBotCommand,
};
