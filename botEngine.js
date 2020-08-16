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
    
    const regexOk = new RegExp("ok", "i");
    const regexHi = new RegExp("hi", "i");
    const regexHello = new RegExp("hello", "i");
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
      if (message == regexOk)
        {
          message.channel.send(`Hello there, ${message.author}! It seems you misunderstood our instructions. Please return to <#693244715839127653> and read carefully.`);
        }
      if else (message == regexHi || regexHello) {
        message.channel.send(`Hello back at you, ${message.author}! You need to return to <#693244715839127653> and read so you can gain access to the rest of the chat and reintroduce yourself.`);
      }
        else 
        {
          message.channel.send(`Hello ${message.author}! If you haven't yet, go read the <#693244715839127653> for instructions on how to access the rest of our discord server.
If you are still having trouble after following the instructions, DM a maintainer or core member.`);
        }
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
