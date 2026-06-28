const {
  Guild,
  GuildMember,
  Role,
  TextChannel,
} = require('../../test/mocks/discord');
const mockUsers = require('../../test/mocks/database-users/getting-hired-users');
const config = require('../../config');
const db = require('../../db');

let GettingHiredMessageService;

beforeAll(async () => {
  GettingHiredMessageService =
    await require('./getting-hired-message.service').new();
});

beforeEach(async () => {
  const initialDbState = mockUsers.map((user) => user.id);
  await db.query('TRUNCATE getting_hired_participants;');
  await db.query(
    `INSERT INTO getting_hired_participants SELECT * FROM unnest($1::text[]);`,
    [initialDbState],
  );
  GettingHiredMessageService.cache = new Set(initialDbState);
  jest.clearAllMocks();
});

afterAll(async () => {
  await db.end();
});

const coreRole = new Role(1, 'core');
const generalChannel = new TextChannel('000');
const gettingHiredChannel = new TextChannel(
  config.channels.gettingHiredChannelId,
);

function createMessage({ author, channel }) {
  return {
    member: author,
    content: 'hello',
    channel: channel,
    guild: new Guild({
      members: [author, ...mockUsers.map(({ id }) => new GuildMember({ id }))],
      channels: [generalChannel, gettingHiredChannel],
      roles: [coreRole],
    }),
    reply: jest.fn(),
  };
}

describe('On sending message in Getting Hired channel', () => {
  it('Sends DM to author if they have not posted in the channel before', async () => {
    const author = new GuildMember({ id: 'newbie', username: 'newbie' });
    const message = createMessage({ author, channel: gettingHiredChannel });

    GettingHiredMessageService.handleMessage(message);
    expect(author.send).toHaveBeenCalled();
  });
});
