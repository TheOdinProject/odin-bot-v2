const SpamBanningService = require("./spam-banning.service");
const config = require("../../config");

class Channel {
  constructor(id) {
    this.id = id;
    this.send = jest.fn((arg) => {
      this.arg = arg;
    });
  }
}

const guild = {
  channels: {
    cache: [
      new Channel("2342314"),
      new Channel("101010"),
      new Channel("22223333"),
      new Channel(config.channels.moderationLog),
      new Channel("2302382"),
      new Channel("000000"),
    ],
  },
};

describe("Banning spammer with DM enabled", () => {
  let sendArg;
  let banArg;
  let reactArg;

  const messageMock = {
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
  };

  let reply;
  const interactionMock = {
    reply: jest.fn((message) => {
      reply = message;
    }),
    options: {
      getMessage: () => messageMock,
    },
    guild,
  };

  it("Discord ban api is called with the correct reason", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.member.ban).toHaveBeenCalledTimes(1);
    expect(banArg).toMatchSnapshot();
  });

  it("Discord message api is called with the correct message", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.author.send).toHaveBeenCalledTimes(1);
    expect(sendArg).toMatchSnapshot();
  });

  it("Reacts with the correct emoji", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.react).toHaveBeenCalledTimes(1);
    expect(reactArg).toMatchSnapshot();
  });

  it("Sends log to the correct channel", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    guild.channels.cache.forEach((channel) => {
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
    expect(reply).toMatchSnapshot();
  });
});

describe("Banning spammer who has DM set to private", () => {
  let banArg;
  let reactArg;

  const messageMock = {
    author: {
      id: "123",
      send: jest.fn(() => {
        throw new Error("Cannot send DM to user");
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
  };

  let reply;
  const interactionMock = {
    reply: jest.fn((message) => {
      reply = message;
    }),
    options: {
      getMessage: () => messageMock,
    },
    guild,
  };

  it("Discord ban api is called with the correct reason", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.member.ban).toHaveBeenCalledTimes(1);
    expect(banArg).toMatchSnapshot();
  });

  it("Discord message api is called and error handled", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.author.send).toHaveBeenCalledTimes(1);
  });

  it("Reacts with the correct emoji", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.react).toHaveBeenCalledTimes(1);
    expect(reactArg).toMatchSnapshot();
  });

  it("Sends log to the correct channel", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    guild.channels.cache.forEach((channel) => {
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
    expect(reply).toMatchSnapshot();
  });
});

describe("Banning spammer that has left the server", () => {
  let reactArg;

  const messageMock = {
    author: {
      id: "123",
      send: jest.fn(() => {}),
    },
    member: null,
    react: jest.fn((arg) => {
      reactArg = arg;
    }),
  };

  let reply;
  const interactionMock = {
    reply: jest.fn((message) => {
      reply = message;
    }),
    options: {
      getMessage: () => messageMock,
    },
    guild,
  };

  it("Author message sending api is not called", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.author.send).not.toHaveBeenCalled();
  });

  it("Reacts with the correct emoji to automod message", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.react).toHaveBeenCalledTimes(1);
    expect(reactArg).toMatchSnapshot();
  });

  it("Does not log any channel", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    guild.channels.cache.forEach((channel) => {
      expect(channel.send).not.toHaveBeenCalled();
    });
  });

  it("Sends back correct interaction reply to calling moderator", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(reply).toMatchSnapshot();
  });
});
