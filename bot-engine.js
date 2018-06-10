const botCommands = [];

function registerBotCommand(regex, fn) {
  botCommands.push({ regex, fn });
}

async function listenToMessages(gitter, roomId) {
  const room = await gitter.rooms.find(roomId);
  const events = room.streaming().chatMessages();
  events.on("chatMessages", message => {
    if (
      message.operation !== "create" ||
      message.model.fromUser.username === "odin-bot"
    ) {
      return;
    }

    const messageData = {
      data: message.model,
      text: message.model.text,
      room: room
    };

    botCommands.forEach(async ({ regex, fn }) => {
      if (messageData.text.toLowerCase().match(regex)) {
        messageData.room.send(await fn(messageData));
      }
    });
  });
}

module.exports = { listenToMessages, registerBotCommand };
