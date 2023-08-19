const { RotationService } = require("./rotation.service");

function interactionUsersBuilder(usersArray) {
  return usersArray.reduce((acc, user, index) => {
    acc[`user${index}`] = user;
    return acc;
  }, {});
}

function mockInteractionBuilder(subcommand, guild, users, reply) {
  return {
    options: {
      getSubcommand: () => subcommand,
      getUser: (name) => users[name],
    },
    guild,
    reply,
  };
}

function getUsers(count, start = 0) {
  const users = [
    { id: "1234", username: "Foo", nickname: '' },
    { id: "5678", username: "Baz", nickname: '' },
    { id: "9101", username: "Bang", nickname: '' },
    { id: "1121", username: "Bing", nickname: '' },
    { id: "3141", username: "Bong", nickname: '' },
    { id: "5161", username: "Ding", nickname: '' },
  ];

  if (start > 0) {
    return users.slice(start, count + start)
  }
  
  if (count) {
    return users.slice(start, count)
  }

  return users.slice(start)
}

function mockServerBuilder(usersArray) {
  const users = usersArray || getUsers()
  const usersById = users.reduce((acc, user) => {
    const { id, username, nickname } = user;
    acc[id] = { user: { username }, nickname };
    return acc;
  }, {});

  return {
    members: {
      fetch: (id) => usersById[id],
    },
  };
}

jest.mock("../redis");

describe("creation", () => {
  it("creates a rotation and reports the inital queue order", async () => {
    const rotation = new RotationService("test", "test");

    const reply = jest.fn();
    const creationUsers = getUsers(2)
    const server = mockServerBuilder();
    const interaction = mockInteractionBuilder(
      "create",
      server,
      interactionUsersBuilder(creationUsers),
      reply
    );

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order initalized as: Foo > Baz >"
    );
  });

  it("addresses users by nickname if they have one", async () => {
    const rotation = new RotationService("test", "test");

    const reply = jest.fn();
    const creationUsers = getUsers(2)
    creationUsers[0].nickname = "Bar"
    const server = mockServerBuilder(creationUsers);
    const interaction = mockInteractionBuilder(
      "create",
      server,
      interactionUsersBuilder(creationUsers),
      reply
    );

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order initalized as: Bar > Baz >"
    );
  });

  it("handles various numbers of users", async () => {
    const rotation = new RotationService("test", "test");

    const reply = jest.fn();
    const creationUsers = getUsers(6)
    const server = mockServerBuilder();
    const interaction = mockInteractionBuilder(
      "create",
      server,
      interactionUsersBuilder(creationUsers),
      reply
    );

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order initalized as: Foo > Baz > Bang > Bing > Bong > Ding >"
    );
  });

  it("only replies once", async () => {
    const rotation = new RotationService("test", "test");

    const reply = jest.fn();
    const creationUsers = getUsers(2)
    const server = mockServerBuilder();
    const interaction = mockInteractionBuilder(
      "create",
      server,
      interactionUsersBuilder(creationUsers),
      reply
    );

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenCalledTimes(1);
  });
});

describe("addition", () => {
  it("adds one person to the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(2)
    const additionUsers = getUsers(1, 2)
    const server = mockServerBuilder();
    const creationInteraction = mockInteractionBuilder(
      "create",
      server,
      interactionUsersBuilder(creationUsers),
      () => {}
    );

    const reply = jest.fn();
    const addInteraction = mockInteractionBuilder(
      "add",
      server,
      interactionUsersBuilder(additionUsers),
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(addInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Foo > Baz > Bang >"
    );
  });

  it("adds multiple people to the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(2)
    const additionUsers = getUsers(2, 2)
    const server = mockServerBuilder();
    const creationInteractionUsers = interactionUsersBuilder(creationUsers);
    const creationInteraction = mockInteractionBuilder(
      "create",
      server,
      creationInteractionUsers,
      () => {}
    );

    const reply = jest.fn();
    const addInteractionUsers = interactionUsersBuilder(additionUsers);
    const addInteraction = mockInteractionBuilder(
      "add",
      server,
      addInteractionUsers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(addInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Foo > Baz > Bang > Bing >"
    );
  });

  it("only replies once", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = [
      { id: "1234", username: "Foo" },
      { id: "5678", username: "Baz" },
    ];
    const addUsers = [
      { id: "9101", username: "Bang" },
      { id: "1121", username: "Bing" },
    ];
    const server = mockServerBuilder([...creationUsers, ...addUsers]);

    const creationInteractionUsers = interactionUsersBuilder(creationUsers);
    const creationInteraction = mockInteractionBuilder(
      "create",
      server,
      creationInteractionUsers,
      () => {}
    );

    const reply = jest.fn();
    const addInteractionUsers = interactionUsersBuilder(addUsers);
    const addInteraction = mockInteractionBuilder(
      "add",
      server,
      addInteractionUsers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(addInteraction);

    expect(reply).toHaveBeenCalledTimes(1);
  });
});

describe("removal", () => {
  it("removes one person from the start of the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3)
    const removalusers = creationUsers.slice(0, 1)
    const server = mockServerBuilder();
    const creationInteraction = mockInteractionBuilder(
      "create",
      server,
      interactionUsersBuilder(creationUsers),
      () => {}
    );

    const reply = jest.fn();
    const addInteraction = mockInteractionBuilder(
      "remove",
      server,
      interactionUsersBuilder(removalusers),
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(addInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Baz > Bang >"
    );
  });

  it("removes one person from the middle of the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3)
    const removalusers = creationUsers.slice(1, 2)
    const server = mockServerBuilder();
    const creationInteraction = mockInteractionBuilder(
      "create",
      server,
      interactionUsersBuilder(creationUsers),
      () => {}
    );

    const reply = jest.fn();
    const addInteraction = mockInteractionBuilder(
      "remove",
      server,
      interactionUsersBuilder(removalusers),
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(addInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Foo > Bang >"
    );
  });

  it("removes one person from the end of the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3)
    const removalusers = creationUsers.slice(2)
    const server = mockServerBuilder();
    const creationInteraction = mockInteractionBuilder(
      "create",
      server,
      interactionUsersBuilder(creationUsers),
      () => {}
    );

    const reply = jest.fn();
    const addInteraction = mockInteractionBuilder(
      "remove",
      server,
      interactionUsersBuilder(removalusers),
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(addInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Foo > Baz >"
    );
  });

  it("only replies once", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = [
      { id: "1234", username: "Foo" },
      { id: "5678", username: "Baz" },
    ];
    const addUsers = [
      { id: "9101", username: "Bang" },
      { id: "1121", username: "Bing" },
    ];
    const server = mockServerBuilder([...creationUsers, ...addUsers]);

    const creationInteractionUsers = interactionUsersBuilder(creationUsers);
    const creationInteraction = mockInteractionBuilder(
      "create",
      server,
      creationInteractionUsers,
      () => {}
    );

    const reply = jest.fn();
    const addInteractionUsers = interactionUsersBuilder(addUsers);
    const addInteraction = mockInteractionBuilder(
      "add",
      server,
      addInteractionUsers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(addInteraction);

    expect(reply).toHaveBeenCalledTimes(1);
  });
});