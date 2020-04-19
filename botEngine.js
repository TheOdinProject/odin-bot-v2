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

function registerBotCommand(_pattern, fn) {
	let pattern, modifiers;
	if (_pattern.pop) {
		[pattern, modifiers] = _pattern;
	} else {
		pattern = _pattern;
		modifiers = "";
	}

	botCommands.push({
    regex: [
      new RegExp("^" + pattern + "$", modifiers),
      new RegExp("^" + pattern + "(?![\a\d/])", modifiers),
      new RegExp("(?<=[^\a\d/])" + pattern + "$", modifiers),
      new RegExp("(?<=[^\a\d/])" + pattern + "(?![\a\d/])", modifiers),
  ],
    fn,
  });
}

async function listenToMessages(client) {
  client.on("message", message => {
    // Prevent bot from responding to its own messages
    if (message.author === client.user) {
      return;
    }

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

    if (message.channel.id === '693255421607280670') {
      message.channel.send("Hello! If you haven't yet, go read the rules for instructions on how to access the rest of our discord server.")
      message.channel.send("If you are still having trouble after following the instructions, DM a moderator")
      return
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


    botCommands.forEach(async command => {
      if (process.argv.includes("dev") && message.channel.type != 'dm') {
        return
      }
			let matched = false;
			command.regex.forEach(pattern => {
				if (!matched) {
					const match = message.content.toLowerCase().match(pattern);
					if (match) {
						matched = true;
						authorBuffer.push(createAuthorEntry(message))
						try {
							const response = await command.fn(message);

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
				}
			});
    });
  });
}

module.exports = { listenToMessages, registerBotCommand };
