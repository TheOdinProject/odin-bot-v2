const botCommands = [];

let authorBuffer = []

const createAuthorEntry = function(message) {
  const entry = {
    author: message.author.id,
    timeOut: false
  }

  setTimeout(function(){
    entry.timeOut = true
  }, 60000)

  return entry
}

const flushAuthorEntries = function() {
  authorBuffer = authorBuffer.filter(entry => entry.timeOut == false)
}

function registerBotCommand(regex, fn) {
  botCommands.push({ regex, fn });
}

async function listenToMessages(client) {
  client.on("message", message => {
    // Prevent bot from responding to its own messages
    if (message.author === client.user) {
      return;
    }

    const regex = new RegExp("ok", "i");
    const NOBOT_ROLE_ID = "513916941212188698";

    // can't bot if user is NOBOT
    if (
      message.author &&
      message.author.lastMessage &&
      message.author.lastMessage.member &&
      message.author.lastMessage.member.roles &&
      message.author.lastMessage.member.roles.has(NOBOT_ROLE_ID)
    ) {
      return;
    }

    if (
      message.channel.id === '693255421607280670' &&
      message.member.roles.find(role => role.name === 'loki?')
    ) {
      if (regex.test(message))
        {
          message.channel.send(`Hello there, ${message.author}! It seems you misunderstood our instructions. Please return to <#693244715839127653> and read carefully.`);
        }
      else
        {
          message.channel.send(`Hello ${message.author}! If you haven't yet, go read the <#693244715839127653> for instructions on how to access the rest of our discord server.
If you are still having trouble after following the instructions, DM a Maintainer or Core member.`);
        }
      return;
    } else if (message.channel.id === '') { // creations-showcase
      message.channel
        .send("Reminder: This channel is for posting links to your creations only. You can discuss the projects posted here in the sibling channel #creations-discussion")
        .delete({ timeout: 43200000 }); // self delete after 12 hours
      return;
    }

    const authorEntryCount = authorBuffer.reduce((count, current) => {
      if (current.author == message.author.id) {
        return count + 1
      }
    },0)

    flushAuthorEntries()

    if (authorEntryCount > 10) {
      console.log('DENIED')
      return
    }

    botCommands.forEach(async ({ regex, fn }) => {
      if (process.argv.includes("dev") && message.channel.type != 'dm') {
        return
      }
      if (message.content.toLowerCase().match(regex)) {
        authorBuffer.push(createAuthorEntry(message))
        try {
          const response = await fn(message);

          if (response) {
            try {
              message.channel.send(response);
            } catch (e) {
              console.log(e);
            }
          }
        }
        catch(e) {
          console.log(e)
        }
      }
    });
  });
}

module.exports = { listenToMessages, registerBotCommand };
