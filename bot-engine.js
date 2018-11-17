const botCommands = [];

function registerBotCommand(regex, fn) {
  botCommands.push({ regex, fn });
}

async function listenToMessages(client) {
  client.on('message', (messageData) => {
    // Prevent bot from responding to its own messages
    if (messageData.author === client.user) {
      return;
    }
    
    botCommands.forEach(async ({ regex, fn }) => {
      if (messageData.content.toLowerCase().match(regex)) {
        messageData.channel.send(await fn(messageData));
      }
    });
  });
}

module.exports = { listenToMessages, registerBotCommand };
