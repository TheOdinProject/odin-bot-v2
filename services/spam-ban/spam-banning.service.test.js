const SpamBanningService = require("./spam-banning.service");
const config = require("../../config");

function createInteractionMock(message, guild) {
  let replyArg;

  return {
    reply: jest.fn((arg) => {
      replyArg = arg;
    }),

    guild,
    message,

    // Used by service to retrieve the message
    options: { getMessage: () => message },

    getReplyArg: () => replyArg,
    getAuthorSendArg: () => message.getSendArg(),
    getBanArg: () => message.getBanArg(),
    getReactArg: () => message.getReactArg(),
    getChannelSendArg: () =>
      guild.channels.cache.map((c) => c.getSendArg()).find((m) => m),
  };
}

function createMessageMock() {
  let sendArg;
  let banArg;
  let reactArg;

  return {
    author: {
      id: "123",
      send: jest.fn((arg) => {
        sendArg = arg;
      }),
    },
    member: {
      ban: jest.fn((arg) => {
        banArg = arg;
      }),
    },
    react: jest.fn((arg) => {
      reactArg = arg;
    }),
    getSendArg: () => sendArg,
    getBanArg: () => banArg,
    getReactArg: () => reactArg,
  };
}

function createChannelMock(id) {
  let sendArg;
  return {
    id,
    send: jest.fn((arg) => {
      sendArg = arg;
    }),
    getSendArg: () => sendArg,
  };
}

const createGuildMock = () => ({
  channels: {
    cache: [
      createChannelMock("2342314"),
      createChannelMock("101010"),
      createChannelMock("22223333"),
      createChannelMock(config.channels.moderationLog),
      createChannelMock("2302382"),
      createChannelMock("000000"),
    ],
  },
});

describe("Banning spammer with DM enabled", () => {
  let interactionMock;
  beforeEach(() => {
    const messageMock = createMessageMock();
    const guildMock = createGuildMock();
    interactionMock = createInteractionMock(messageMock, guildMock);
  });

  it("Discord ban api is called with the correct reason", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.member.ban).toHaveBeenCalledTimes(1);
    expect(interactionMock.getBanArg()).toMatchSnapshot();
  });

  it("Discord message api is called with the correct message", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.author.send).toHaveBeenCalledTimes(1);
    expect(interactionMock.getAuthorSendArg()).toMatchSnapshot();
  });

  it("Reacts with the correct emoji", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.react).toHaveBeenCalledTimes(1);
    expect(interactionMock.getReactArg()).toMatchSnapshot();
  });

  it("Sends log to the correct channel", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    interactionMock.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLog) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(interactionMock.getChannelSendArg()).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalledTimes(1);
      }
    });
  });

  it("Sends back correct interaction reply to calling moderator", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });
});

describe("Banning spammer who has DM set to private", () => {
  let interactionMock;
  beforeEach(() => {
    const guildMock = createGuildMock();
    const messageMock = createMessageMock();
    messageMock.author.send = jest.fn(() => {
      throw new Error("Can't contact user");
    });
    interactionMock = createInteractionMock(messageMock, guildMock);
  });

  it("Discord ban api is called with the correct reason", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.member.ban).toHaveBeenCalledTimes(1);
    expect(interactionMock.getBanArg()).toMatchSnapshot();
  });

  it("Discord message api is called and error handled", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.author.send).toHaveBeenCalledTimes(1);
  });

  it("Reacts with the correct emoji", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.react).toHaveBeenCalledTimes(1);
    expect(interactionMock.getReactArg()).toMatchSnapshot();
  });

  it("Sends log to the correct channel", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    interactionMock.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLog) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.getSendArg()).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalledTimes(1);
      }
    });
  });

  it("Sends back correct interaction reply to calling moderator", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });
});

// describe("Banning spammer that has left the server", () => {
//   let reactArg;
//
//   const messageMock = {
//     author: {
//       id: "123",
//       send: jest.fn(() => {}),
//     },
//     member: null,
//     react: jest.fn((arg) => {
//       reactArg = arg;
//     }),
//   };
//
//   let reply;
//   const interactionMock = {
//     reply: jest.fn((message) => {
//       reply = message;
//     }),
//     options: {
//       getMessage: () => messageMock,
//     },
//     guild: createGuild(),
//   };
//
//   it("Author message sending api is not called", async () => {
//     await SpamBanningService.handleInteraction(interactionMock);
//     expect(messageMock.author.send).not.toHaveBeenCalled();
//   });
//
//   it("Reacts with the correct emoji to automod message", async () => {
//     await SpamBanningService.handleInteraction(interactionMock);
//     expect(messageMock.react).toHaveBeenCalledTimes(1);
//     expect(reactArg).toMatchSnapshot();
//   });
//
//   it("Does not log any channel", async () => {
//     await SpamBanningService.handleInteraction(interactionMock);
//     interactionMock.guild.channels.cache.forEach((channel) => {
//       expect(channel.send).not.toHaveBeenCalled();
//     });
//   });
//
//   it("Sends back correct interaction reply to calling moderator", async () => {
//     await SpamBanningService.handleInteraction(interactionMock);
//     expect(reply).toMatchSnapshot();
//   });
// });
