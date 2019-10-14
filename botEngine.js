const botCommands = [];

function registerBotCommand(regex, fn) {
  botCommands.push({ regex, fn });
}

async function listenToMessages(client) {
  client.on("message", message => {
    console.log(message)
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

    botCommands.forEach(async ({ regex, fn }) => {
      if (message.content.toLowerCase().match(regex)) {
        try {
          const response = await fn(message);
        }
        catch(e) {
          console.log(e)
        }

        if (response) {
          try {
            message.channel.send(response);
          } catch (e) {
            console.log(e);
          }
        }
      }
    });
  });
}

module.exports = { listenToMessages, registerBotCommand };
