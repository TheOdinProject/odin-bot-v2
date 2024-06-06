const SpamBanningService = require("./spam-banning.service");

describe("Successfully bans user", () => {
  // Message from interaction, will be changed per test
  let interactionMessage;
  // Will be replaced by the reply coming from interaction
  let reply;

  const interactionMock = {
    options: {
      getMessage: () => interactionMessage,
    },
    reply: jest.fn((message) => {
      reply = message;
    }),
  };
  it("User is banned successfully on full ban", async () => {
    const author = { id: "123", send: jest.fn(() => {}) };
    const member = { ban: jest.fn(() => {}) };
    interactionMessage = { author, member };
    await SpamBanningService.handleInteraction(interactionMock);
    expect(author.send).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });
});
