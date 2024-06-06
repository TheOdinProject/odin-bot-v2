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

  it("User is banned successfully on full ban", async () => {
    messageMock.author = { id: "123", send: jest.fn(() => {}) };
    messageMock.member = { ban: jest.fn(() => {}) };
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.author.send).toHaveBeenCalled();
    expect(messageMock.member.ban).toHaveBeenCalled();
    expect(messageMock.react).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });

  it("User is banned but couldn't send a DM", async () => {
    messageMock.author = {
      id: "007",
      send: jest.fn(() => {
        throw new Error("");
      }),
    };
    messageMock.member = { ban: jest.fn(() => {}) };
    await SpamBanningService.handleInteraction(interactionMock);
    expect(messageMock.author.send).toHaveBeenCalled();
    expect(messageMock.member.ban).toHaveBeenCalled();
    expect(messageMock.react).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });
});
