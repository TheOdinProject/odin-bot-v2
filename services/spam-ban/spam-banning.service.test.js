const SpamBanningService = require("./spam-banning.service");

describe("Banning spammer that is still on the server", () => {
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
  };

  it("Discord ban api is called with the correct reason", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.member.ban).toHaveBeenCalled();
    expect(banArg).toMatchSnapshot();
  });

  it("Discord message api is called with the correct message", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.author.send).toHaveBeenCalled();
    expect(sendArg).toMatchSnapshot();
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
  };

  it("Discord ban api is called with the correct reason", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.member.ban).toHaveBeenCalled();
    expect(banArg).toMatchSnapshot();
  });

  it("Discord message api is called and error handled", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.author.send).toHaveBeenCalled();
  });

  it("Sends back correct interaction reply to calling moderator", async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(reply).toMatchSnapshot();
  });
});
