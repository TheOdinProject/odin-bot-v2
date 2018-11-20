const botCommands = [];

function registerBotCommand(regex, fn) {
  botCommands.push({regex, fn});
}

async function listenToMessages(client) {
  client.on('message', messageData => {
    // Prevent bot from responding to its own messages
    if (messageData.author === client.user) {
      return;
    }

    // can't bot if user is NOBOT
    if (
      messageData.author &&
      messageData.author.lastMessage &&
      messageData.author.lastMessage.member &&
      messageData.author.lastMessage.member.roles &&
      messageData.author.lastMessage.member.roles.has('513916941212188698')
    ) {
      return;
    }

    botCommands.forEach(async ({regex, fn}) => {
      if (messageData.content.toLowerCase().match(regex)) {
        messageData.channel.send(await fn(messageData));
      }
    });
  });
}

module.exports = {listenToMessages, registerBotCommand};
