const { RotationService } = require('./rotation.service');
const db = require('../../db');
const mockUsers = require('../../test/mocks/database-users/rotations');
const { Guild, GuildMember, TextChannel } = require('../../test/mocks/discord');

jest.mock('../redis');

const members = mockUsers.map((user) => new GuildMember(user));
const channel = new TextChannel('000');
const guild = new Guild({ members, channels: [channel] });

function createSubcommand(subcommand) {
  return (mentionedMembers) => {
    return {
      guild,
      options: {
        getSubcommand: () => subcommand,
        getMember: (optionName) => mentionedMembers[optionName],
      },
      reply: jest.fn((message) => message).mockName('Bot reply'),
    };
  };
}

async function populateQueue(members) {
  await db.query(
    `
      UPDATE rotations
      SET queue = $1::text[]
      WHERE name = 'test';
    `,
    [members.map(({ id }) => id)],
  );
}

async function readQueue() {
  const { rows } = await db.query(
    "SELECT queue FROM rotations WHERE name = 'test';",
  );
  return rows[0].queue;
}

async function emptyQueue() {
  await db.query('TRUNCATE rotations;');
  await db.query("INSERT INTO rotations VALUES ('test', ARRAY[]::text[]);");
}

beforeEach(async () => {
  await emptyQueue();
  RotationService.rotations = [];
  jest.clearAllMocks();
});

afterAll(async () => {
  await db.end();
});

describe('initialization', () => {
  it('tracks created rotations', () => {
    new RotationService('test1', 'test1');
    expect(RotationService.rotations).toEqual(['test1']);

    new RotationService('test2', 'test2');
    expect(RotationService.rotations).toEqual(['test1', 'test2']);

    new RotationService('test3', 'test3');
    expect(RotationService.rotations).toEqual(['test1', 'test2', 'test3']);
  });
});

describe('add', () => {
  const createInteraction = createSubcommand('add');

  it('creates a fresh queue with one member', async () => {
    const rotation = new RotationService('test', 'test');

    const interaction = createInteraction({ user0: members[0] });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${members[0]} successfully added to the queue\n\nTest rotation queue order: User 0 *(current)* >`,
    );
    await expect(readQueue()).resolves.toEqual([members[0].id]);
  });

  it('adds one member to populated queue', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0]];
    await populateQueue(queue);

    const interaction = createInteraction({ user0: members[1] });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${members[1]} successfully added to the queue\n\nTest rotation queue order: User 0 *(current)* > User 1 >`,
    );
    await expect(readQueue()).resolves.toEqual([members[0].id, members[1].id]);
  });

  it('adds multiple members to empty queue in a single command', async () => {
    const rotation = new RotationService('test', 'test');

    const interaction = createInteraction({
      user0: members[0],
      user1: members[1],
    });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${members[0]} ${members[1]} successfully added to the queue\n\nTest rotation queue order: User 0 *(current)* > User 1 >`,
    );
    await expect(readQueue()).resolves.toEqual([members[0].id, members[1].id]);
  });

  it('adds multiple members to populated queue in a single command', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0]];
    await populateQueue(queue);

    const interaction = createInteraction({
      user0: members[1],
      user1: members[2],
    });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${members[1]} ${members[2]} successfully added to the queue\n\nTest rotation queue order: User 0 *(current)* > User 1 > User 2 >`,
    );
    await expect(readQueue()).resolves.toEqual([
      members[0].id,
      members[1].id,
      members[2].id,
    ]);
  });

  it('does not add a member more than once in a single command', async () => {
    const rotation = new RotationService('test', 'test');

    const interaction = createInteraction({
      user0: members[0],
      user1: members[0],
    });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${members[0]} successfully added to the queue\n\nTest rotation queue order: User 0 *(current)* >`,
    );
    await expect(readQueue()).resolves.toEqual([members[0].id]);
  });

  it('does not add a member to the queue if they are already in it', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0]];
    await populateQueue(queue);

    const interaction = createInteraction({ user0: members[0] });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenLastCalledWith(
      `${queue.at(0)} not added as they are already in the queue\n\nTest rotation queue order: User 0 *(current)* >`,
    );
    await expect(readQueue()).resolves.toEqual([members[0].id]);
  });

  it('escapes markdown in usernames and nicknames', async () => {
    const rotation = new RotationService('test', 'test');

    const interaction = createInteraction({
      user0: members[3],
      user1: members[4],
    });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${members[3]} ${members[4]} successfully added to the queue\n\nTest rotation queue order: User \\*\\*3\\*\\* *(current)* > User \\|\\|4\\|\\| >`,
    );
    await expect(readQueue()).resolves.toEqual([members[3].id, members[4].id]);
  });
});

describe.skip('remove', () => {
  const createInteraction = createSubcommand('remove');

  it('removes member when at the start of the queue', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0], members[1], members[2]];
    await populateQueue(queue);

    const interaction = createInteraction({ user0: queue.at(0) });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${members[0]} removed from the queue\n\nTest rotation queue order: User 1 *(current)* > User 2 >`,
    );
    expect(readQueue()).resolves.toEqual([members[1].id, members[2].id]);
  });

  it('removes member when in the middle of the queue', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0], members[1], members[2]];
    await populateQueue(queue);

    const interaction = createInteraction({ user0: queue.at(1) });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${members[1]} removed from the queue\n\nTest rotation queue order: User 0 *(current)* > User 2 >`,
    );
    expect(readQueue()).resolves.toEqual([members[0].id, members[2].id]);
  });

  it('removes member when at the end of the queue', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0], members[1], members[2]];
    await populateQueue(queue);

    const interaction = createInteraction({ user0: queue.at(-1) });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${members[2]} removed from the queue\n\nTest rotation queue order: User 0 *(current)* > User 1 >`,
    );
    expect(readQueue()).resolves.toEqual([members[0].id, members[1].id]);
  });

  it('escapes markdown in usernames and nicknames', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0], members[3], members[4]];
    await populateQueue(queue);

    const interaction = createInteraction({ user0: queue.at(0) });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${members[0]} removed from the queue\n\nTest rotation queue order: User \\*\\*3\\*\\* *(current)* > User \\|\\|4\\|\\| >`,
    );
    expect(readQueue()).resolves.toEqual([members[0].id]);
  });
});

describe.skip('swap', () => {
  const createInteraction = createSubcommand('swap');

  it("swaps start and end members' positions", async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0], members[1], members[2]];
    await populateQueue(queue);

    const interaction = createInteraction({
      user0: queue.at(0),
      user1: queue.at(-1),
    });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${queue.at(0)} ${queue.at(-1)} swapped position in the queue\n\nTest rotation queue order: User 2 *(current)* > User 1 > User 0 >`,
    );
    expect(readQueue()).resolves.toEqual([
      members[2].id,
      members[1].id,
      members[0].id,
    ]);
  });

  it("swaps start and middle members' positions", async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0], members[1], members[2]];
    await populateQueue(queue);

    const interaction = createInteraction({
      user0: queue.at(0),
      user1: queue.at(1),
    });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${queue.at(0)} ${queue.at(1)} swapped position in the queue\n\nTest rotation queue order: User 1 *(current)* > User 0 > User 2 >`,
    );
    expect(readQueue()).resolves.toEqual([
      members[1].id,
      members[0].id,
      members[2].id,
    ]);
  });

  it("swaps middle and end members' positions", async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0], members[1], members[2]];
    await populateQueue(queue);

    const interaction = createInteraction({
      user0: queue.at(1),
      user1: queue.at(-1),
    });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${queue.at(1)} ${queue.at(-1)} swapped position in the queue\n\nTest rotation queue order: User 0 *(current)* > User 2 > User 1 >`,
    );
    expect(readQueue()).resolves.toEqual([
      members[0].id,
      members[2].id,
      members[1].id,
    ]);
  });

  it('warns when used with fewer than 2 members in the queue', async () => {
    const rotation = new RotationService('test', 'test');

    const interaction = createInteraction({
      user0: members[0],
      user1: members[1],
    });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      'Fewer than two members in the queue. Try adding some with `/triage add`!',
    );
  });

  it('escapes markdown in usernames and nicknames', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[3], members[4]];
    await populateQueue(queue);

    const interaction = createInteraction({
      user0: queue.at(0),
      user1: queue.at(-1),
    });
    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${queue.at(0)} ${queue.at(-1)} swapped position in the queue\n\nTest rotation queue order: User \\|\\|4\\|\\| *(current)* > User \\*\\*3\\*\\* >`,
    );
    expect(readQueue()).resolves.toEqual([members[4].id, members[3].id]);
  });
});

describe.skip('read', () => {
  const interaction = createSubcommand('read')({});

  it('reports the queue order', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0], members[1]];
    await populateQueue(queue);

    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      'Test rotation queue order: User 0 *(current)* > User 1 >',
    );
  });

  it('reports empty queue', async () => {
    const rotation = new RotationService('test', 'test');

    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith('No members');
  });

  it('only replies once', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0], members[1]];
    await populateQueue(queue);

    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledTimes(1);
  });

  it('escapes markdown in usernames and nicknames', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[3], members[4]];
    await populateQueue(queue);

    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      'Test rotation queue order: User \\*\\*3\\*\\* *(current)* > User \\|\\|4\\|\\| >',
    );
  });
});

describe.skip('rotate', () => {
  const interaction = createSubcommand('rotate')({});

  it('rotates the queue, pings the new "current" member in the rotation then reports the new queue order', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0], members[1], members[2]];
    await populateQueue(queue);

    await rotation.handleInteraction(interaction);
    expect(interaction.reply).toHaveBeenCalledWith(
      `${queue.at(1)} it's your turn for the test rotation.\n\nTest rotation queue order: User 1 *(current)* > User 2 > User 0 >`,
    );
    expect(readQueue()).resolves.toEqual([
      members[1].id,
      members[2].id,
      members[0].id,
    ]);

    await rotation.handleInteraction(interaction);
    expect(interaction.reply).toHaveBeenCalledWith(
      `${queue.at(2)} it's your turn for the test rotation.\n\nTest rotation queue order: User 2 *(current)* > User 0 > User 1 >`,
    );
    expect(readQueue()).resolves.toEqual([
      members[2].id,
      members[0].id,
      members[1].id,
    ]);
  });

  it('only replies once', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0], members[1], members[2]];
    await populateQueue(queue);

    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledTimes(1);
  });

  it('warns when used with fewer than 2 members in the queue', async () => {
    const rotation = new RotationService('test', 'test');

    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      'Fewer than two members in the queue. Try adding some with `/triage add`!',
    );
  });

  it('escapes markdown in usernames and nicknames', async () => {
    const rotation = new RotationService('test', 'test');
    const queue = [members[0], members[3], members[4]];
    await populateQueue(queue);

    await rotation.handleInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      `${queue.at(1)} it's your turn for the test rotation.\n\nTest rotation queue order: User \\*\\*3\\*\\* *(current)* > User \\|\\|4\\|\\| > User 0 >`,
    );
    expect(readQueue()).resolves.toEqual([members[3].id, members[4].id]);
  });
});
