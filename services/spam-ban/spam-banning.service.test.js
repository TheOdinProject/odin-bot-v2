const SpamBanningService = require("./spam-banning.service");

describe("Successfully bans user", () => {
  // Message from interaction, will be changed per test
  const messageMock = { react: jest.fn(() => {}) };
  // Will be replaced by the reply coming from interaction
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
    expect(reply).toMatchSnapshot();
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
    expect(reply).toMatchSnapshot();
  });

  it("User has left the server", async () => {
    messageMock.author = { id: "008", send: jest.fn(() => {}) };
    messageMock.member = null;
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.author.send).not.toHaveBeenCalled();
    expect(messageMock.react).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });
});
