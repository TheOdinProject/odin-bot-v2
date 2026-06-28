const { Guild, GuildMember, TextChannel } = require('../../test/mocks/discord');
const mockUsers = require('../../test/mocks/database-users/getting-hired-users');
const config = require('../../config');
const db = require('../../db');

let gettingHiredMessageService;

beforeAll(async () => {
  gettingHiredMessageService =
    await require('./getting-hired-message.service').new();
});

beforeEach(async () => {
  const initialDbState = mockUsers.map((user) => user.id);
  await db.query('TRUNCATE getting_hired_participants;');
  await db.query(
    'INSERT INTO getting_hired_participants SELECT * FROM unnest($1::text[]);',
    [initialDbState],
  );
  gettingHiredMessageService.cache = new Set(initialDbState);
  jest.clearAllMocks();
});

afterAll(async () => {
  await db.end();
});

describe('On sending message in Getting Hired channel', () => {
  const gettingHiredChannel = new TextChannel(
    config.channels.gettingHiredChannelId,
  );

  function createMessage(author) {
    return {
      member: author,
      content: 'hello',
      channel: gettingHiredChannel,
      guild: new Guild({
        members: [
          author,
          ...mockUsers.map(({ id }) => new GuildMember({ id })),
        ],
        channels: [gettingHiredChannel],
      }),
      reply: jest.fn(),
    };
  }

  it('Sends DM to author if they have not posted in the channel before', async () => {
    const author = new GuildMember({ id: 'newbie', username: 'newbie' });
    const message = createMessage(author);

    await gettingHiredMessageService.handleMessage(message);
    expect(author.send).toHaveBeenCalled();
  });

  it('Caches author if they have not posted in the channel before', async () => {
    const author = new GuildMember({ id: 'newbie', username: 'newbie' });
    const message = createMessage(author);

    await gettingHiredMessageService.handleMessage(message);
    expect(gettingHiredMessageService.cache).toContain(author.id);
  });

  it('Adds author to database if they have not posted in the channel before', async () => {
    const author = new GuildMember({ id: 'newbie', username: 'newbie' });
    const message = createMessage(author);

    await gettingHiredMessageService.handleMessage(message);
    const result = await db.query(
      `
        SELECT EXISTS (
          SELECT 1 FROM getting_hired_participants
          WHERE discord_id = $1
        );
      `,
      [author.id],
    );
    expect(result.rows[0].exists).toBe(true);
  });

  it('Does not DM author if they have posted in the channel before', async () => {
    const author = new GuildMember(mockUsers[0]);
    const message = createMessage(author);

    await gettingHiredMessageService.handleMessage(message);
    expect(author.send).not.toHaveBeenCalled();
  });

  it('Does not DM author if they are not cached but are in the database', async () => {
    const author = new GuildMember(mockUsers[0]);
    const message = createMessage(author);
    gettingHiredMessageService.cache.delete(author.id);

    await gettingHiredMessageService.handleMessage(message);
    expect(author.send).not.toHaveBeenCalled();
  });

  it('Caches author if they are not cached but are in the database', async () => {
    const author = new GuildMember(mockUsers[0]);
    const message = createMessage(author);
    gettingHiredMessageService.cache.delete(author.id);

    await gettingHiredMessageService.handleMessage(message);
    expect(gettingHiredMessageService.cache).toContain(author.id);
  });
});
