const { RotationService } = require('./rotation.service');
const {
  buildInteraction,
  getUsers,
  initializeServer,
} = require('../../utils/slash-command-helpers');

jest.mock('../redis');

describe('addition', () => {
  it('creates a rotation and reports the inital queue order', async () => {
    const rotation = new RotationService('test', 'test');

    const reply = jest.fn();
    const users = getUsers(2);
    const server = initializeServer();
    const interaction = buildInteraction('add', server, users, reply);

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenCalledWith(
      '<@1234> <@5678> successfully added to the queue\n\ntest rotation queue order: Foo > Baz >',
    );
  });

  it('adds one person to the queue and reports the new queue order', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(2);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const additionUsers = getUsers(1, 2);
    const additionInteraction = buildInteraction(
      'add',
      server,
      additionUsers,
      reply,
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(additionInteraction);

    expect(reply).toHaveBeenCalledWith(
      '<@9101> successfully added to the queue\n\ntest rotation queue order: Foo > Baz > Bang >',
    );
  });

  it('adds multiple people to the queue and reports the new queue order', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(2);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const additionUsers = getUsers(2, 2);
    const additionInteraction = buildInteraction(
      'add',
      server,
      additionUsers,
      reply,
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(additionInteraction);

    expect(reply).toHaveBeenCalledWith(
      '<@9101> <@1121> successfully added to the queue\n\ntest rotation queue order: Foo > Baz > Bang > Bing >',
    );
  });

  it('does not add people to the queue multiple times', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(2);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const additionUsers = getUsers(3, 1);
    const additionInteraction = buildInteraction(
      'add',
      server,
      additionUsers,
      reply,
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(additionInteraction);

    expect(reply).toHaveBeenCalledWith(
      'Baz not added as they are already in the queue\n\n <@9101> <@1121> successfully added to the queue\n\ntest rotation queue order: Foo > Baz > Bang > Bing >',
    );
  });

  it('addresses rejected users by nickname if they have one', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(2);
    const additionUsers = getUsers(1);
    additionUsers[0].nickname = 'Bar';
    const server = initializeServer([...creationUsers, ...additionUsers]);

    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();

    const additionInteraction = buildInteraction(
      'add',
      server,
      additionUsers,
      reply,
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(additionInteraction);

    expect(reply).toHaveBeenCalledWith(
      'Bar not added as they are already in the queue\n\ntest rotation queue order: Bar > Baz >',
    );
  });

  it('only replies once', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(2);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const additionUsers = getUsers(2, 2);
    const additionInteraction = buildInteraction(
      'add',
      server,
      additionUsers,
      reply,
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(additionInteraction);

    expect(reply).toHaveBeenCalledTimes(1);
  });

  it('escapes markdown in usernames and nicknames', async () => {
    const rotation = new RotationService('test', 'test');

    const users = getUsers(2);
    users[0].nickname = 'Foo `test`';
    users[1].username = 'Baz *test*';

    const server = initializeServer(users);

    const reply = jest.fn();
    const interaction = buildInteraction('add', server, users, reply);

    await rotation.handleInteraction(interaction);

    expect(reply).toHaveBeenCalledWith(
      '<@1234> <@5678> successfully added to the queue\n\ntest rotation queue order: Foo \\`test\\` > Baz \\*test\\* >',
    );
  });
});

describe('removal', () => {
  it('removes one person from the start of the queue and reports the new queue order', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const removalusers = creationUsers.slice(0, 1);
    const removalInteraction = buildInteraction(
      'remove',
      server,
      removalusers,
      reply,
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(removalInteraction);

    expect(reply).toHaveBeenCalledWith(
      '<@1234> removed from the queue\n\ntest rotation queue order: Baz > Bang >',
    );
  });

  it('removes one person from the middle of the queue and reports the new queue order', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const removalusers = creationUsers.slice(1, 2);
    const removalInteraction = buildInteraction(
      'remove',
      server,
      removalusers,
      reply,
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(removalInteraction);

    expect(reply).toHaveBeenCalledWith(
      '<@5678> removed from the queue\n\ntest rotation queue order: Foo > Bang >',
    );
  });

  it('removes one person from the end of the queue and reports the new queue order', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const removalusers = creationUsers.slice(2);
    const removalInteraction = buildInteraction(
      'remove',
      server,
      removalusers,
      reply,
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(removalInteraction);

    expect(reply).toHaveBeenCalledWith(
      '<@9101> removed from the queue\n\ntest rotation queue order: Foo > Baz >',
    );
  });

  it('only replies once', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const removalusers = creationUsers.slice(2);
    const removalInteraction = buildInteraction(
      'remove',
      server,
      removalusers,
      reply,
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(removalInteraction);

    expect(reply).toHaveBeenCalledTimes(1);
  });

  it('escapes markdown in usernames and nicknames', async () => {
    const rotation = new RotationService('test', 'test');

    const users = getUsers(2);
    users[0].nickname = 'Foo `test`';
    users[1].username = 'Baz *test*';

    const server = initializeServer(users);

    const additionInteraction = buildInteraction(
      'add',
      server,
      users,
      () => {},
    );

    const reply = jest.fn();
    const removalUsers = users.slice(1);
    const removalInteraction = buildInteraction(
      'remove',
      server,
      removalUsers,
      reply,
    );

    await rotation.handleInteraction(additionInteraction);

    await rotation.handleInteraction(removalInteraction);

    expect(reply).toHaveBeenCalledWith(
      '<@5678> removed from the queue\n\ntest rotation queue order: Foo \\`test\\` >',
    );
  });
});

describe('swapping', () => {
  it('swaps one person from the start of the queue with one from the end of the queue and reports the new queue order', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const swapUsers = [creationUsers[0], creationUsers[2]];
    const swappingInteraction = buildInteraction(
      'swap',
      server,
      swapUsers,
      reply,
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(swappingInteraction);

    expect(reply).toHaveBeenCalledWith(
      '<@1234> <@9101> swapped position in the queue\n\ntest rotation queue order: Bang > Baz > Foo >',
    );
  });

  it('swaps one person from the start of the queue with one from the middle of the queue and reports the new queue order', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const swapUsers = [creationUsers[0], creationUsers[1]];
    const swappingInteraction = buildInteraction(
      'swap',
      server,
      swapUsers,
      reply,
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(swappingInteraction);

    expect(reply).toHaveBeenCalledWith(
      '<@1234> <@5678> swapped position in the queue\n\ntest rotation queue order: Baz > Foo > Bang >',
    );
  });

  it('swaps one person from the middle of the queue with one from the end of the queue and reports the new queue order', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const swapUsers = [creationUsers[1], creationUsers[2]];
    const swappingInteraction = buildInteraction(
      'swap',
      server,
      swapUsers,
      reply,
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(swappingInteraction);

    expect(reply).toHaveBeenCalledWith(
      '<@5678> <@9101> swapped position in the queue\n\ntest rotation queue order: Foo > Bang > Baz >',
    );
  });

  it('only replies once', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const swapUsers = [creationUsers[0], creationUsers[2]];
    const swappingInteraction = buildInteraction(
      'swap',
      server,
      swapUsers,
      reply,
    );

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(swappingInteraction);

    expect(reply).toHaveBeenCalledTimes(1);
  });

  it('escapes markdown in usernames and nicknames', async () => {
    const rotation = new RotationService('test', 'test');

    const users = getUsers(2);
    users[0].nickname = 'Foo `test`';
    users[1].username = 'Baz *test*';

    const server = initializeServer(users);

    const additionInteraction = buildInteraction(
      'add',
      server,
      users,
      () => {},
    );

    const reply = jest.fn();
    const swapInteraction = buildInteraction('swap', server, users, reply);

    await rotation.handleInteraction(additionInteraction);

    await rotation.handleInteraction(swapInteraction);

    expect(reply).toHaveBeenCalledWith(
      '<@1234> <@5678> swapped position in the queue\n\ntest rotation queue order: Baz \\*test\\* > Foo \\`test\\` >',
    );
  });
});

describe('reading', () => {
  it('reports the queue order', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const readInteraction = buildInteraction('read', server, [], reply);

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(readInteraction);

    expect(reply).toHaveBeenCalledWith(
      'test rotation queue order: Foo > Baz > Bang >',
    );
  });

  it('only replies once', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const readInteraction = buildInteraction('read', server, [], reply);

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(readInteraction);

    expect(reply).toHaveBeenCalledTimes(1);
  });

  it('escapes markdown in usernames and nicknames', async () => {
    const rotation = new RotationService('test', 'test');

    const users = getUsers(2);
    users[0].nickname = 'Foo `test`';
    users[1].username = 'Baz *test*';

    const server = initializeServer(users);

    const additionInteraction = buildInteraction(
      'add',
      server,
      users,
      () => {},
    );

    const reply = jest.fn();
    const readInteraction = buildInteraction('read', server, [], reply);

    await rotation.handleInteraction(additionInteraction);

    await rotation.handleInteraction(readInteraction);

    expect(reply).toHaveBeenCalledWith(
      'test rotation queue order: Foo \\`test\\` > Baz \\*test\\* >',
    );
  });
});

describe('rotation', () => {
  it('pings the user up in the rotation, rotates the queue, and reports the new queue order', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const rotationInteraction = buildInteraction('rotate', server, [], reply);

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(rotationInteraction);

    expect(reply).toHaveBeenCalledWith(
      "<@1234> it's your turn for the test rotation.\n\ntest rotation queue order: Baz > Bang > Foo >",
    );
  });

  it('only replies once', async () => {
    const rotation = new RotationService('test', 'test');

    const creationUsers = getUsers(3);
    const server = initializeServer();
    const creationInteraction = buildInteraction(
      'add',
      server,
      creationUsers,
      () => {},
    );

    const reply = jest.fn();
    const rotationInteraction = buildInteraction('rotate', server, [], reply);

    await rotation.handleInteraction(creationInteraction);

    await rotation.handleInteraction(rotationInteraction);

    expect(reply).toHaveBeenCalledTimes(1);
  });

  it('escapes markdown in usernames and nicknames', async () => {
    const rotation = new RotationService('test', 'test');

    const users = getUsers(2);
    users[0].nickname = 'Foo `test`';
    users[1].username = 'Baz *test*';

    const server = initializeServer(users);

    const additionInteraction = buildInteraction(
      'add',
      server,
      users,
      () => {},
    );

    const reply = jest.fn();
    const rotateInteraction = buildInteraction('rotate', server, [], reply);

    await rotation.handleInteraction(additionInteraction);

    await rotation.handleInteraction(rotateInteraction);

    expect(reply).toHaveBeenCalledWith(
      "<@1234> it's your turn for the test rotation.\n\ntest rotation queue order: Baz \\*test\\* > Foo \\`test\\` >",
    );
  });
});
