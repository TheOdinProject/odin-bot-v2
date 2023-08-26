const { RotationService } = require("./rotation.service");
const {
  buildInteraction,
  getUsers,
  initializeServer,
} = require("../../utils/slash-command-helpers");

jest.mock("../redis");

describe("addition", () => {
  it("creates a rotation and reports the inital queue order", async () => {
    const rotation = new RotationService("test", "test");

    const reply = jest.fn();
    const users = getUsers(2);
    const server = initializeServer();
    const interaction = buildInteraction("add", server, users, reply);

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Foo > Baz >"
    );
  });

  it("addresses users by nickname if they have one", async () => {
    const rotation = new RotationService("test", "test");

    const reply = jest.fn();
    const users = getUsers(2);
    users[0].nickname = "Bar";
    const server = initializeServer(users);
    const interaction = buildInteraction("add", server, users, reply);

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Bar > Baz >"
    );
  });

  it("handles various numbers of users", async () => {
    const rotation = new RotationService("test", "test");

    const reply = jest.fn();
    const users = getUsers(6);
    const server = initializeServer();
    const interaction = buildInteraction("add", server, users, reply);

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Foo > Baz > Bang > Bing > Bong > Ding >"
    );
  });

  it("adds one person to the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(2);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const additionUsers = getUsers(1, 2);
    const additionInteraction = buildInteraction(
      "add",
      server,
      additionUsers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(additionInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Foo > Baz > Bang >"
    );
  });

  it("adds multiple people to the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(2);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const additionUsers = getUsers(2, 2);
    const additionInteraction = buildInteraction(
      "add",
      server,
      additionUsers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(additionInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Foo > Baz > Bang > Bing >"
    );
  });

  it("only replies once", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(2);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const additionUsers = getUsers(2, 2);
    const additionInteraction = buildInteraction(
      "add",
      server,
      additionUsers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(additionInteraction);

    expect(reply).toHaveBeenCalledTimes(1);
  });
});

describe("removal", () => {
  it("removes one person from the start of the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const removalusers = creationUsers.slice(0, 1);
    const removalInteraction = buildInteraction(
      "remove",
      server,
      removalusers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(removalInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Baz > Bang >"
    );
  });

  it("removes one person from the middle of the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const removalusers = creationUsers.slice(1, 2);
    const removalInteraction = buildInteraction(
      "remove",
      server,
      removalusers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(removalInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Foo > Bang >"
    );
  });

  it("removes one person from the end of the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const removalusers = creationUsers.slice(2);
    const removalInteraction = buildInteraction(
      "remove",
      server,
      removalusers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(removalInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Foo > Baz >"
    );
  });

  it("only replies once", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const removalusers = creationUsers.slice(2);
    const removalInteraction = buildInteraction(
      "remove",
      server,
      removalusers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(removalInteraction);

    expect(reply).toHaveBeenCalledTimes(1);
  });
});

describe("swapping", () => {
  it("swaps one person from the start of the queue with one from the end of the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const swapUsers = [creationUsers[0], creationUsers[2]];
    const swappingInteraction = buildInteraction(
      "swap",
      server,
      swapUsers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(swappingInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Bang > Baz > Foo >"
    );
  });

  it("swaps one person from the start of the queue with one from the middle of the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const swapUsers = [creationUsers[0], creationUsers[1]];
    const swappingInteraction = buildInteraction(
      "swap",
      server,
      swapUsers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(swappingInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Baz > Foo > Bang >"
    );
  });

  it("swaps one person from the middle of the queue with one from the end of the queue and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const swapUsers = [creationUsers[1], creationUsers[2]];
    const swappingInteraction = buildInteraction(
      "swap",
      server,
      swapUsers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(swappingInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order updated to: Foo > Bang > Baz >"
    );
  });

  it("only replies once", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const swapUsers = [creationUsers[0], creationUsers[2]];
    const swappingInteraction = buildInteraction(
      "swap",
      server,
      swapUsers,
      reply
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(swappingInteraction);

    expect(reply).toHaveBeenCalledTimes(1);
  });
});

describe("reading", () => {
  it("reports the queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const readInteraction = buildInteraction("read", server, [], reply);

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(readInteraction);

    expect(reply).toHaveBeenCalledWith(
      "test rotation queue order is: Foo > Baz > Bang >"
    );
  });

  it("only replies once", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const readInteraction = buildInteraction("read", server, [], reply);

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(readInteraction);

    expect(reply).toHaveBeenCalledTimes(1);
  });
});

describe("rotation", () => {
  it("pings the user up in the rotation, rotates the queue, and reports the new queue order", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const rotationInteraction = buildInteraction("rotate", server, [], reply);

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(rotationInteraction);

    expect(reply).toHaveBeenCalledWith(
      "<@1234> it's your turn for the test rotation.\nThe test rotation order is now  Baz > Bang > Foo >."
    );
  });

  it("only replies once", async () => {
    const rotation = new RotationService("test", "test");

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      "add",
      server,
      creationUsers,
      () => {}
    );

    const reply = jest.fn();
    const rotationInteraction = buildInteraction("rotate", server, [], reply);

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(rotationInteraction);

    expect(reply).toHaveBeenCalledTimes(1);
  });
});
