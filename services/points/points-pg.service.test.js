const { Guild, GuildMember, User } = require('../../utils/mocks/discord');
const PointsService = require('./points-pg.service');
const db = require('../../db');
const mockUsers = require('../../utils/mocks/database-users/slash-commands');

// only read ops in these tests
beforeAll(async () => {
  const initialDbState = [
    mockUsers.withPoints.map((user) => user.id),
    mockUsers.withPoints.map((user) => user.points),
  ];
  await db.query('TRUNCATE points;');
  await db.query(
    `INSERT INTO points SELECT * FROM unnest($1::text[], $2::integer[]);`,
    initialDbState,
  );
});

afterAll(async () => {
  await db.end();
});

const guild = new Guild({
  members: mockUsers.inGuild.map(
    ({ id, username }) => new GuildMember({ id, username }),
  ),
});

describe('user', () => {
  const createInteraction = (mentionedUser) => ({
    guild,
    options: {
      getSubcommand: () => 'user',
      getUser: () => mentionedUser,
    },
    reply: jest.fn((message) => message),
  });

  it('Returns correct reply when user does not have any points', async () => {
    const interaction = createInteraction(new User(mockUsers.all[0]));
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    expect(botReply.embeds[0].data).toMatchObject({
      title: 'TOP Discord points for User 0',
      fields: [
        { name: 'Points', value: 'User 0 has 0 points.' },
        { name: 'Rank', value: 'User 0 is not on the leaderboard.' },
      ],
    });
  });

  it('Replies with error message if user is not in the guild', async () => {
    const interaction = createInteraction(new User({ id: 'NotInGuild' }));
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    expect(botReply).toBe(
      'Sorry, could not find points information for that user!',
    );
  });

  it('Returns correct reply when user has points', async () => {
    const interaction = createInteraction(new User(mockUsers.all[5]));
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    expect(botReply.embeds[0].data).toMatchObject({
      title: 'TOP Discord points for User 5',
      fields: [
        { name: 'Points', value: 'User 5 has 5 points.' },
        { name: 'Rank', value: 'User 5 is ranked number 26.' },
      ],
    });
  });

  it('Singularizes response when user has 1 point', async () => {
    const interaction = createInteraction(new User(mockUsers.all[1]));
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    expect(botReply.embeds[0].data).toMatchObject({
      title: 'TOP Discord points for User 1',
      fields: [
        { name: 'Points', value: 'User 1 has 1 point.' },
        { name: 'Rank', value: 'User 1 is ranked number 30.' },
      ],
    });
  });

  it('Appends :tada: emoji if user is ranked 1', async () => {
    const interaction = createInteraction(new User(mockUsers.all[30]));
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    expect(botReply.embeds[0].data).toMatchObject({
      title: 'TOP Discord points for User 30',
      fields: [
        { name: 'Points', value: 'User 30 has 30 points.' },
        { name: 'Rank', value: 'User 30 is ranked number 1 :tada:' },
      ],
    });
  });

  it('Escapes markdown characters in response text', async () => {
    const interaction = createInteraction(new User(mockUsers.all[4]));
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    expect(botReply.embeds[0].data).toMatchObject({
      title: 'TOP Discord points for User \\*\\*4\\*\\*',
      fields: [
        { name: 'Points', value: 'User \\*\\*4\\*\\* has 4 points.' },
        {
          name: 'Rank',
          value: 'User \\*\\*4\\*\\* is ranked number 27.',
        },
      ],
    });
  });
});
