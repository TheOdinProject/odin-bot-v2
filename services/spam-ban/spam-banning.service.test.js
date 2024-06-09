const SpamBanningService = require("./spam-banning.service");

describe("Successfully bans user", () => {
  // Message from interaction, will be changed per test
  const messageMock = { react: jest.fn(() => {}) };
  // Reply will be replaced by the reply coming from interaction automaticly
  let reply;

  const interactionMock = {
    options: {
      getMessage: () => messageMock,
    },
    reply: jest.fn((message) => {
      reply = message;
    }),
  };

  it("Discord ban api is called", async () => {
    messageMock.author = { id: "123", send: jest.fn(() => {}) };
    messageMock.member = { ban: jest.fn(() => {}) };
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.member.ban).toHaveBeenCalled();
  });

  it("Discord ban api is called with right message", async () => {
    let banReason = {};
    messageMock.author = { id: "007", send: jest.fn(() => {}) };
    messageMock.member = {
      ban: jest.fn((arg) => {
        banReason = arg;
      }),
    };

    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.member.ban).toHaveBeenCalled();
    expect(banReason).toMatchSnapshot();
  });

  it("Discord message api is called", async () => {
    messageMock.author = { id: "123", send: jest.fn(() => {}) };
    messageMock.member = { ban: jest.fn(() => {}) };
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.author.send).toHaveBeenCalled();
  });

  it("Discord message api is called with correct message", async () => {
    let userMessage = {};
    messageMock.author = {
      id: "123",
      send: jest.fn((arg) => {
        userMessage = arg;
      }),
    };
    messageMock.member = { ban: jest.fn(() => {}) };
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.author.send).toHaveBeenCalled();
    expect(userMessage).toMatchSnapshot();
  });

  // it("User has left the server", async () => {
  //   messageMock.author = { id: "008", send: jest.fn(() => {}) };
  //   messageMock.member = null;
  //   await SpamBanningService.handleInteraction(interactionMock);
  //   expect(messageMock.author.send).not.toHaveBeenCalled();
  //   expect(messageMock.react).toHaveBeenCalled();
  //   expect(reply).toMatchSnapshot();
  // });
});
