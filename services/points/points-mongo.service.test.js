const { MongoMemoryServer } = require('mongodb-memory-server');
const { Guild, GuildMember, User } = require('../../utils/mocks/discord');
const mockUsers = require('../../utils/mocks/database-users/slash-commands');

let database;
let PointsService;

beforeAll(async () => {
  database = await MongoMemoryServer.create();

  // must not hoist mock/require - both depend on MongoMemoryServer db URI
  jest.doMock('../../config.js', () => ({
    ...jest.requireActual('../../config.js'),
    databaseURI: database.getUri(),
  }));
  PointsService = require('./points-mongo.service.js');

  const usersWithPoints = mockUsers.filter((user) => user.points !== 0);
  await PointsService.users.insertMany(usersWithPoints);
});

afterAll(async () => {
  await database.stop();
  await PointsService.client.close();
});

const usersInGuild = mockUsers.filter(
  (user) => user.discordID !== 'NotInGuild',
);
const GUILD = new Guild({
  members: usersInGuild.map((user) => new GuildMember({ id: user.discordID })),
});

describe('user', () => {
  const createInteraction = (mentionedUser) => ({
    guild: GUILD,
    options: {
      getSubcommand: () => 'user',
      getUser: () => mentionedUser,
    },
    reply: jest.fn((message) => message),
  });

  it('Returns correct reply when user does not have any points', async () => {
    const interaction = createInteraction(new User({ id: '0' }));
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
    const interaction = createInteraction(new User({ id: '5' }));
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
    const interaction = createInteraction(new User({ id: '1' }));
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
    const interaction = createInteraction(new User({ id: '30' }));
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
    const interaction = createInteraction(new User({ id: '**0**' }));
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    expect(botReply.embeds[0].data).toMatchObject({
      title: 'TOP Discord points for User \\*\\*0\\*\\*',
      fields: [
        { name: 'Points', value: 'User \\*\\*0\\*\\* has 0 points.' },
        {
          name: 'Rank',
          value: 'User \\*\\*0\\*\\* is not on the leaderboard.',
        },
      ],
    });
  });
});
