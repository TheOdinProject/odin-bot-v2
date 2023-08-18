const { RotationService } = require("./rotation.service");

function mockServerBuilder(users) {
  const usersById = Object.keys(users).reduce((acc, user) => {
    const { id, username, nickname } = users[user];
    acc[id] = { user: { username }, nickname };
    return acc;
  }, {});
  return {
    members: {
      fetch: (id) => usersById[id],
    },
  };
}

function mockInteractionBuilder(subcommand, users, reply) {
  return {
    options: {
      getSubcommand: () => subcommand,
      getUser: (name) => users[name],
    },
    guild: mockServerBuilder(users),
    reply,
  };
}

jest.mock("../redis");

describe("creation", () => {
  it("creates a rotation and reports the inital queue order", async () => {
    const rotation = new RotationService("test", "test");

    const reply = jest.fn();
    const interaction = mockInteractionBuilder(
      "create",
      {
        user0: { id: "1234", username: "Foo" },
        user1: { id: "5678", username: "Baz" },
      },
      reply
    );

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenNthCalledWith(1,
      "test rotation queue order initalized as: Baz > Foo >"
    );
  });

  it("addresses users by nickname if they have one", async () => {
    const rotation = new RotationService("test", "test");

    const reply = jest.fn();
    const interaction = mockInteractionBuilder(
      "create",
      {
        user0: { id: "1234", username: "Foo", nickname: "Bar" },
        user1: { id: "5678", username: "Baz" },
      },
      reply
    );

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenNthCalledWith(1,
      "test rotation queue order initalized as: Baz > Bar >"
    );
  });

  it("handles various numbers of users", async () => {
    const rotation = new RotationService("test", "test");

    const reply = jest.fn();
    const interaction = mockInteractionBuilder(
      "create",
      {
        user0: { id: "1234", username: "Foo", nickname: "Bar" },
        user1: { id: "5678", username: "Baz" },
        user2: { id: "9101", username: "Bang" },
        user3: { id: "1121", username: "Bing" },
        user4: { id: "3141", username: "Bong" },
        user5: { id: "5161", username: "Ding" },
      },
      reply
    );

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenNthCalledWith(1,
      "test rotation queue order initalized as: Ding > Bong > Bing > Bang > Baz > Bar >"
    );
  });

  it("only replies once", async () => {
    const rotation = new RotationService("test", "test");

    const reply = jest.fn();
    const interaction = mockInteractionBuilder(
      "create",
      {
        user0: { id: "1234", username: "Foo", nickname: "Bar" },
        user1: { id: "5678", username: "Baz" },
      },
      reply
    );

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenCalledTimes(1)
  });
});

describe("addition", () => {
  it.skip("adds people to the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");
    const creationInteraction = mockInteractionBuilder(
      "create",
      {
        user0: { id: "1234", username: "Foo", nickname: "Bar" },
        user1: { id: "5678", username: "Baz" },
      },
      () => {}
    );

    const reply = jest.fn();
    const interaction = mockInteractionBuilder(
      "add",
      {
        user0: { id: "9101", username: "Bang" },
        user1: { id: "1121", username: "Bing" },
      },
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenNthCalledWith(1,
      "test rotation queue is: Baz > Foo > Bang > Bing >"
    );
  });

  it.skip("only replies once", async () => {
    const rotation = new RotationService("test", "test");

    const reply = jest.fn();
    const interaction = mockInteractionBuilder(
      "create",
      {
        user3: { id: "1234", username: "Foo", nickname: "Bar" },
        user1: { id: "5678", username: "Baz" },
      },
      reply
    );

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenCalledTimes(1)
  });
});
