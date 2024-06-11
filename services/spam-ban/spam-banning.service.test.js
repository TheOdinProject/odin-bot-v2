const SpamBanningService = require("./spam-banning.service");
const config = require("../../config");

function createInteractionMock(message, guild) {
  let replyArg;

  return {
    reply: jest.fn((arg) => {
      replyArg = arg;
    }),

    guild,
    options: { getMessage: () => message },
    getReplyArg: () => replyArg,
  };
}

function createMessageMock() {
  let sendArg;
  let banArg;
  let reactArg;

  return {
    author: {
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

class ChannelMock {
  constructor(id) {
    this.id = id;
    this.send = jest.fn((arg) => {
      this.arg = arg;
    });
  }
}

const createGuild = () => ({
  channels: {
    cache: [
      new ChannelMock("2342314"),
      new ChannelMock("101010"),
      new ChannelMock("22223333"),
      new ChannelMock(config.channels.moderationLog),
      new ChannelMock("2302382"),
      new ChannelMock("000000"),
    ],
  },
});

describe("Banning spammer with DM enabled", () => {
  const guild = createGuild();

  const interactionMock = createInteractionMock(
    createMessageMock(),
    createGuild(),
  );

  it("Discord ban api is called with the correct reason", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.member.ban).toHaveBeenCalledTimes(1);
    expect(interactionMock.message.banArg).toMatchSnapshot();
  });

  it("Discord message api is called with the correct message", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.author.send).toHaveBeenCalledTimes(1);
    expect(messageMock.sendArg).toMatchSnapshot();
  });

  it("Reacts with the correct emoji", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.react).toHaveBeenCalledTimes(1);
    expect(messageMock.reactArg).toMatchSnapshot();
  });

  it("Sends log to the correct channel", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    interactionMock.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLog) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.arg).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalledTimes(1);
      }
    });
  });

  it("Sends back correct interaction reply to calling moderator", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.reply).toMatchSnapshot();
  });
});
// describe("Banning spammer who has DM set to private", () => {
//   let banArg;
//   let reactArg;
//
//   const messageMock = {
//     author: {
//       id: "123",
//       send: jest.fn(() => {
//         throw new Error("Cannot send DM to user");
//       }),
//     },
//     member: {
//       ban: jest.fn((arg) => {
//         banArg = arg;
//       }),
//     },
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
//   it("Discord ban api is called with the correct reason", async () => {
//     await SpamBanningService.handleInteraction(interactionMock);
//     expect(messageMock.member.ban).toHaveBeenCalledTimes(1);
//     expect(banArg).toMatchSnapshot();
//   });
//
//   it("Discord message api is called and error handled", async () => {
//     await SpamBanningService.handleInteraction(interactionMock);
//     expect(messageMock.author.send).toHaveBeenCalledTimes(1);
//   });
//
//   it("Reacts with the correct emoji", async () => {
//     await SpamBanningService.handleInteraction(interactionMock);
//     expect(messageMock.react).toHaveBeenCalledTimes(1);
//     expect(reactArg).toMatchSnapshot();
//   });
//
//   it("Sends log to the correct channel", async () => {
//     await SpamBanningService.handleInteraction(interactionMock);
//     interactionMock.guild.channels.cache.forEach((channel) => {
//       if (channel.id === config.channels.moderationLog) {
//         expect(channel.send).toHaveBeenCalledTimes(1);
//         expect(channel.arg).toMatchSnapshot();
//       } else {
//         expect(channel.send).not.toHaveBeenCalledTimes(1);
//       }
//     });
//   });
//
//   it("Sends back correct interaction reply to calling moderator", async () => {
//     await SpamBanningService.handleInteraction(interactionMock);
//     expect(reply).toMatchSnapshot();
//   });
// });
//
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
