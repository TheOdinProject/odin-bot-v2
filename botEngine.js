const botCommands = [];

let authorBuffer = [];

let creationsMessage = null;

const adminRoles = ['core', 'maintainer', 'admin'];

let currentIntroductionsMessage = null;
const introductionsWelcomeMessage = 'Welcome to The Odin Project! Take a moment to survey all of the channels on the sidebar, especially the <#823266307293839401> channel for answers to commonly asked questions. We\'re excited for you to join us on your programming journey. Happy learning!';

const createAuthorEntry = function (message) {
  const entry = {
    author: message.author.id,
    timeOut: false,
  };

  setTimeout(() => {
    entry.timeOut = true;
  }, 60000);

  return entry;
};

const flushAuthorEntries = function () {
  authorBuffer = authorBuffer.filter((entry) => entry.timeOut === false);
};

function registerBotCommand(regex, fn) {
  botCommands.push({ regex, fn });
}

async function listenToMessages(client) {
  client.on('message', async (message) => {
    // Prevent bot from responding to its own messages
    if (message.author === client.user) {
      return;
    }
    const isAdminMessage = message.member.roles.cache.some((r) => adminRoles.includes(r.name));

    const NOBOT_ROLE_ID = '783764176178774036';

    // can't bot if user is NOBOT
    if (
      message.author
      && message.author.lastMessage
      && message.author.lastMessage.member
      && message.author.lastMessage.member.roles.cache
      && message.author.lastMessage.member.roles.cache.has(NOBOT_ROLE_ID)
    ) {
      return;
    }

    if (message.channel.id === '627445384297316352') { // creations-showcase
      if (creationsMessage) {
        creationsMessage.delete();
      }
      creationsMessage = await message.channel.send('Reminder: This channel is for posting links to your creations only. You can discuss the projects posted here in the sibling channel <#634025871614803968>');
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
              message.channel.send(response);
            } catch (e) {
              console.log(e);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    });

    if (message.channel.id === '690618925494566912') { // introductions
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

module.exports = { listenToMessages, registerBotCommand };
