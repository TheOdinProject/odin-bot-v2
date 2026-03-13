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

describe('leaderboard', () => {
  const createInteraction = (integerOptions) => ({
    guild: GUILD,
    options: {
      getSubcommand: () => 'leaderboard',
      getInteger: (option) => integerOptions[option],
    },
    reply: jest.fn((message) => message),
  });

  it('Returns top 5 leaderboard when no options and limit set', async () => {
    const interaction = createInteraction({});
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    expect(botReply.embeds[0].data).toMatchObject({
      title: 'TOP Discord points leaderboard',
      description: [
        '1. User 30 - 30 :tada:',
        '2. User 29 - 29',
        '3. User 28 - 28',
        '4. User 27 - 27',
        '5. User 26 - 26',
      ].join('\n'),
    });
  });

  it('Returns LIMIT number of leaderboard entries', async () => {
    const interaction = createInteraction({ limit: 7 });
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    expect(botReply.embeds[0].data).toMatchObject({
      title: 'TOP Discord points leaderboard',
      description: [
        '1. User 30 - 30 :tada:',
        '2. User 29 - 29',
        '3. User 28 - 28',
        '4. User 27 - 27',
        '5. User 26 - 26',
        '6. User 25 - 25',
        '7. User 24 - 24',
      ].join('\n'),
    });
  });

  it('Caps LIMIT at 25 entries', async () => {
    const interaction = createInteraction({ limit: 500 });
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    expect(botReply.embeds[0].data).toMatchObject({
      title: 'TOP Discord points leaderboard',
      description: [
        '1. User 30 - 30 :tada:',
        '2. User 29 - 29',
        '3. User 28 - 28',
        '4. User 27 - 27',
        '5. User 26 - 26',
        '6. User 25 - 25',
        '7. User 24 - 24',
        '8. User 23 - 23',
        '9. User 22 - 22',
        '10. User 21 - 21',
        '11. User 20 - 20',
        '12. User 19 - 19',
        '13. User 18 - 18',
        '14. User 17 - 17',
        '15. User 16 - 16',
        '16. User 15 - 15',
        '17. User 14 - 14',
        '18. User 13 - 13',
        '19. User 12 - 12',
        '20. User 11 - 11',
        '21. User 10 - 10',
        '22. User 9 - 9',
        '23. User 8 - 8',
        '24. User 7 - 7',
        '25. User 6 - 6',
      ].join('\n'),
    });
  });

  it('Returns 5 leaderboard entries with a starting offset', async () => {
    const interaction = createInteraction({ offset: 3 });
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    expect(botReply.embeds[0].data).toMatchObject({
      title: 'TOP Discord points leaderboard',
      description: [
        '4. User 27 - 27',
        '5. User 26 - 26',
        '6. User 25 - 25',
        '7. User 24 - 24',
        '8. User 23 - 23',
      ].join('\n'),
    });
  });

  it('Cannot offset beyond leaderboard length', async () => {
    const interaction = createInteraction({ offset: 500 });
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    expect(botReply.embeds[0].data).toMatchObject({
      title: 'TOP Discord points leaderboard',
      description: '30. User 1 - 1',
    });
  });

  it('Allows both offset and limit options together', async () => {
    const interaction = createInteraction({ limit: 6, offset: 5 });
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    expect(botReply.embeds[0].data).toMatchObject({
      title: 'TOP Discord points leaderboard',
      description: [
        '6. User 25 - 25',
        '7. User 24 - 24',
        '8. User 23 - 23',
        '9. User 22 - 22',
        '10. User 21 - 21',
        '11. User 20 - 20',
      ].join('\n'),
    });
  });

  it('Does not include non-guild members in leaderboard', async () => {
    const interaction = createInteraction({});
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    const leaderboard = botReply.embeds[0]?.data.description;
    expect(leaderboard).toEqual(expect.not.stringContaining('NotInGuild'));
  });

  it('Escaped markdown characters in response text', async () => {
    const interaction = createInteraction({ offset: 5, limit: 25 });
    await PointsService.handleInteraction(interaction);

    const botReply = await interaction.reply.mock.results[0]?.value;
    const leaderboard = botReply.embeds[0]?.data.description;
    expect(leaderboard).toEqual(expect.stringContaining('\\*2\\*'));
    expect(leaderboard).toEqual(expect.not.stringContaining('*2*'));
  });
});
