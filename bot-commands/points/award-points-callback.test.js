const { MongoMemoryServer } = require('mongodb-memory-server');
const {
  Client,
  Guild,
  GuildMember,
  TextChannel,
  ODIN_BOT,
} = require('../../utils/mocks/discord');
const mockUsers = require('../../utils/mocks/database-users/awarding-points.js');

let awardPoints;
let database;
let PointsService;
const selfAwardGif = 'http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif';
const IDs = {
  generalChannel: '505093832157691916',
  club40Channel: '707225752608964628',
  noPointsChannel: '513125912070455296',
  club40Role: '707225790546444288',
};
const client = new Client({});
const generalChannel = new TextChannel(IDs.generalChannel);
const club40Channel = new TextChannel(IDs.club40Channel);
const noPointsChannel = new TextChannel(IDs.noPointsChannel);
const channels = [generalChannel, club40Channel, noPointsChannel];

jest.mock('./club-40-gifs.json', () => [
  {
    gif: 'https://i.imgur.com/ofDEfYs.gif',
    author: 'Sully',
  },
]);

beforeAll(async () => {
  database = await MongoMemoryServer.create();

  // must not hoist mock/require - both depend on MongoMemoryServer db URI
  jest.doMock('../../config.js', () => {
    const actual = jest.requireActual('../../config.js');
    actual.channels.noPointsChannelIds = [IDs.noPointsChannel];
    actual.channels.club40ChannelId = IDs.club40Channel;
    actual.roles.club40Id = IDs.club40Role;
    actual.databaseURI = database.getUri();
    return actual;
  });
  awardPoints = require('./award-points-mongo');
  PointsService = require('../../services/points/points-mongo.service.js');

  await PointsService.users.insertMany(mockUsers);
});

afterEach(async () => {
  jest.clearAllMocks();
  await PointsService.users.deleteMany();
  await PointsService.users.insertMany(mockUsers);
});

afterAll(async () => {
  await database.stop();
  await PointsService.client.close();
});

describe('++ / :star:', () => {
  const author = new GuildMember({ id: '99999999' });

  it('Awards point to different member without points', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: author,
      content: `${mentionedMember} ++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [author, mentionedMember],
        channels,
      }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      [`Nice! ${mentionedMember} now has 1 point`],
    ]);
    expect(
      PointsService.users.findOne({ discordID: mentionedMember.id }),
    ).resolves.toMatchObject({ points: 1 });
  });

  it('Awards single point to different member with points', async () => {
    const mentionedMember = new GuildMember({ id: '1' });
    await awardPoints.cb({
      member: author,
      content: `${mentionedMember} ++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [author, mentionedMember],
        channels,
      }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      [`Nice! ${mentionedMember} now has 2 points`],
    ]);
    expect(
      PointsService.users.findOne({ discordID: mentionedMember.id }),
    ).resolves.toMatchObject({ points: 2 });
  });

  it('Awards single point to each of multiple different mentioned members', async () => {
    const mentionedMember1 = new GuildMember({ id: '1' });
    const mentionedMember2 = new GuildMember({ id: '2' });
    await awardPoints.cb({
      member: author,
      content: `${mentionedMember1} ++ ${mentionedMember2} ++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [author, mentionedMember1, mentionedMember2],
        channels,
      }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      [`Nice! ${mentionedMember1} now has 2 points`],
      [`Nice! ${mentionedMember2} now has 3 points`],
    ]);
    expect(
      PointsService.users
        .find({
          discordID: { $in: [mentionedMember1.id, mentionedMember2.id] },
        })
        .toArray(),
    ).resolves.toMatchObject([{ points: 2 }, { points: 3 }]);
  });

  it('Awards point only once for member mentioned multiple times', async () => {
    const mentionedMember = new GuildMember({ id: '1' });
    await awardPoints.cb({
      member: author,
      content: `${mentionedMember} ++ ${mentionedMember} ++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [author, mentionedMember],
        channels,
      }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      [`Nice! ${mentionedMember} now has 2 points`],
    ]);
    expect(
      PointsService.users.findOne({ discordID: mentionedMember.id }),
    ).resolves.toMatchObject({ points: 2 });
  });

  it('Limits awards in a single message to 5', async () => {
    const mentionedMembers = [
      new GuildMember({ id: '1' }),
      new GuildMember({ id: '2' }),
      new GuildMember({ id: '3' }),
      new GuildMember({ id: '4' }),
      new GuildMember({ id: '5' }),
      new GuildMember({ id: '6' }),
    ];
    await awardPoints.cb({
      member: author,
      content: `${mentionedMembers[0]} ++ ${mentionedMembers[1]} ++ ${mentionedMembers[2]} ++ ${mentionedMembers[3]} ++ ${mentionedMembers[4]} ++ ${mentionedMembers[5]} ++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [author, ...mentionedMembers],
        channels,
      }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      ['You can only do up to 5 users at a time...'],
      [`Nice! ${mentionedMembers[0]} now has 2 points`],
      [`Nice! ${mentionedMembers[1]} now has 3 points`],
      [`Nice! ${mentionedMembers[2]} now has 4 points`],
      [`Sweet! ${mentionedMembers[3]} now has 5 points`],
      [`Sweet! ${mentionedMembers[4]} now has 6 points`],
    ]);
    expect(
      PointsService.users
        .find({
          discordID: { $in: mentionedMembers.map((member) => member.id) },
        })
        .toArray(),
    ).resolves.toMatchObject([
      { points: 2 },
      { points: 3 },
      { points: 4 },
      { points: 5 },
      { points: 6 },
      { points: 6 }, // no point awarded!
    ]);
  });

  it('Gives unique response when trying to award OdinBot', async () => {
    await awardPoints.cb({
      member: author,
      content: `${ODIN_BOT} ++`,
      channel: generalChannel,
      client,
      guild: new Guild({ members: [author], channels }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      ['Awwwww shucks... :heart_eyes:'],
    ]);
    expect(
      PointsService.users.findOne({ discordID: ODIN_BOT.id }),
    ).resolves.toBeNull();
  });

  it('Prevents awarding points in a no-points channel', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: author,
      content: `${mentionedMember} ++`,
      channel: noPointsChannel,
      client,
      guild: new Guild({
        members: [author, mentionedMember],
        channels,
      }),
    });

    expect(noPointsChannel.send.mock.calls).toEqual([
      ["You can't give points in this channel!"],
    ]);
    expect(
      PointsService.users.findOne({ discordID: mentionedMember.id }),
    ).resolves.toBeNull();
  });

  it('Prevents self-awarding points', async () => {
    await awardPoints.cb({
      member: author,
      content: `${author} ++`,
      channel: generalChannel,
      client,
      guild: new Guild({ members: [author], channels }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      [selfAwardGif],
      ["You can't give yourself points!"],
    ]);
    expect(
      PointsService.users.findOne({ discordID: author.id }),
    ).resolves.toBeNull();
  });

  it('Does not prevent awarding points to other members when also self-awarding', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: author,
      content: `${author} ++ ${mentionedMember} ++`,
      channel: generalChannel,
      client,
      guild: new Guild({ members: [author, mentionedMember], channels }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      [selfAwardGif],
      ["You can't give yourself points!"],
      [`Nice! ${mentionedMember} now has 1 point`],
    ]);
    expect(
      PointsService.users.findOne({ discordID: author.id }),
    ).resolves.toBeNull();
    expect(
      PointsService.users.findOne({ discordID: mentionedMember.id }),
    ).resolves.toMatchObject({ points: 1 });
  });
});

describe('?++', () => {
  const nonStaffAuthor = new GuildMember({ id: '99999999' });
  const staffAuthor = new GuildMember({ id: '0000000', roles: ['core'] });

  it('Prevents awarding points if author is not staff member', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: nonStaffAuthor,
      content: `${mentionedMember} ?++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [nonStaffAuthor, mentionedMember],
        channels,
      }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      ['Only staff can use ?++ to give double points!'],
    ]);
    expect(
      PointsService.users.findOne({ discordID: mentionedMember.id }),
    ).resolves.toBeNull();
  });

  it('Awards double points to different member if author is staff member', async () => {
    const mentionedMember = new GuildMember({ id: '1' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember} ?++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
      }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      [`Thanks for the great question! ${mentionedMember} now has 3 points`],
    ]);
    expect(
      PointsService.users.findOne({ discordID: mentionedMember.id }),
    ).resolves.toMatchObject({ points: 3 });
  });

  it('Awards double points to each of multiple different mentioned members', async () => {
    const mentionedMember1 = new GuildMember({ id: '1' });
    const mentionedMember2 = new GuildMember({ id: '2' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember1} ?++ ${mentionedMember2} ?++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [staffAuthor, mentionedMember1, mentionedMember2],
        channels,
      }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      [`Thanks for the great question! ${mentionedMember1} now has 3 points`],
      [`Thanks for the great question! ${mentionedMember2} now has 4 points`],
    ]);
    expect(
      PointsService.users
        .find({
          discordID: { $in: [mentionedMember1.id, mentionedMember2.id] },
        })
        .toArray(),
    ).resolves.toMatchObject([{ points: 3 }, { points: 4 }]);
  });

  it('Awards points only once for member mentioned multiple times', async () => {
    const mentionedMember = new GuildMember({ id: '1' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember} ?++ ${mentionedMember} ?++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
      }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      [`Thanks for the great question! ${mentionedMember} now has 3 points`],
    ]);
    expect(
      PointsService.users.findOne({ discordID: mentionedMember.id }),
    ).resolves.toMatchObject({ points: 3 });
  });

  it('Gives unique response when trying to award OdinBot', async () => {
    await awardPoints.cb({
      member: staffAuthor,
      content: `${ODIN_BOT} ?++`,
      channel: generalChannel,
      client,
      guild: new Guild({ members: [staffAuthor], channels }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      ['Awwwww shucks... :heart_eyes:'],
    ]);
    expect(
      PointsService.users.findOne({ discordID: ODIN_BOT.id }),
    ).resolves.toBeNull();
  });

  it('Prevents awarding points in a no-points channel', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember} ?++`,
      channel: noPointsChannel,
      client,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
      }),
    });

    expect(noPointsChannel.send.mock.calls).toEqual([
      ["You can't give points in this channel!"],
    ]);
    expect(
      PointsService.users.findOne({ discordID: mentionedMember.id }),
    ).resolves.toBeNull();
  });

  it('Prevents self-awarding points', async () => {
    await awardPoints.cb({
      member: staffAuthor,
      content: `${staffAuthor} ?++`,
      channel: generalChannel,
      client,
      guild: new Guild({ members: [staffAuthor], channels }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      [selfAwardGif],
      ["You can't give yourself points!"],
    ]);
    expect(
      PointsService.users.findOne({ discordID: staffAuthor.id }),
    ).resolves.toBeNull();
  });

  it('Does not prevent awarding points to other members when also self-awarding', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${staffAuthor} ?++ ${mentionedMember} ?++`,
      channel: generalChannel,
      client,
      guild: new Guild({ members: [staffAuthor, mentionedMember], channels }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      [selfAwardGif],
      ["You can't give yourself points!"],
      [`Thanks for the great question! ${mentionedMember} now has 2 points`],
    ]);
    expect(
      PointsService.users.findOne({ discordID: staffAuthor.id }),
    ).resolves.toBeNull();
    expect(
      PointsService.users.findOne({ discordID: mentionedMember.id }),
    ).resolves.toMatchObject({ points: 2 });
  });

  it('Only uses the ?++ exclamation for ?++ awards (inc. mixed awards)', async () => {
    const mentionedMember1 = new GuildMember({ id: '1' });
    const mentionedMember2 = new GuildMember({ id: '2' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember1} ?++ ${mentionedMember2} ++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [staffAuthor, mentionedMember1, mentionedMember2],
        channels,
      }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      [`Thanks for the great question! ${mentionedMember1} now has 3 points`],
      [`Nice! ${mentionedMember2} now has 3 points`],
    ]);
    expect(
      PointsService.users
        .find({
          discordID: { $in: [mentionedMember1.id, mentionedMember2.id] },
        })
        .toArray(),
    ).resolves.toMatchObject([{ points: 3 }, { points: 3 }]);
  });

  it('Prioritizes double points if same member given mixed awards in the same message', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember} ?++ ${mentionedMember} ?++`,
      channel: generalChannel,
      client,
      guild: new Guild({ members: [staffAuthor, mentionedMember], channels }),
    });

    expect(generalChannel.send.mock.calls).toEqual([
      [`Thanks for the great question! ${mentionedMember} now has 2 points`],
    ]);
    expect(
      PointsService.users.findOne({ discordID: mentionedMember.id }),
    ).resolves.toMatchObject({ points: 2 });
  });
});

describe('Club 40', () => {
  const nonStaffAuthor = new GuildMember({ id: '99999999' });
  const staffAuthor = new GuildMember({ id: '0000000', roles: ['core'] });

  it('Adds member to Club 40 when at 39 points then awarded a single point', async () => {
    const mentionedMember = new GuildMember({ id: '39' });
    await awardPoints.cb({
      member: nonStaffAuthor,
      content: `${mentionedMember} ++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
      }),
    });

    expect(club40Channel.send.mock.calls).toEqual([
      [
        `HEYYY EVERYONE SAY HI TO ${mentionedMember} the newest member of CLUB 40! Please check the pins at the top right!`,
      ],
      ['https://i.imgur.com/ofDEfYs.gif'],
      ['Gif by Sully'],
    ]);
    expect(
      mentionedMember.roles.cache.find((role) => role.name === 'club-40'),
    ).toBeTruthy();
  });

  it('Adds member to Club 40 when at 39 points then awarded double points', async () => {
    const mentionedMember = new GuildMember({ id: '39' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember} ?++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
      }),
    });

    expect(club40Channel.send.mock.calls).toEqual([
      [
        `HEYYY EVERYONE SAY HI TO ${mentionedMember} the newest member of CLUB 40! Please check the pins at the top right!`,
      ],
      ['https://i.imgur.com/ofDEfYs.gif'],
      ['Gif by Sully'],
    ]);
    expect(
      mentionedMember.roles.cache.find((role) => role.name === 'club-40'),
    ).toBeTruthy();
  });

  it('Adds returning Club 40 member when awarded points', async () => {
    const mentionedMember = new GuildMember({ id: '40' });
    await awardPoints.cb({
      member: nonStaffAuthor,
      content: `${mentionedMember} ++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
      }),
    });

    expect(club40Channel.send.mock.calls).toEqual([
      [
        `WELCOME BACK TO CLUB 40 ${mentionedMember}!! Please review the pins at the top right!`,
      ],
      ['https://i.imgur.com/ofDEfYs.gif'],
      ['Gif by Sully'],
    ]);
    expect(
      mentionedMember.roles.cache.find((role) => role.name === 'club-40'),
    ).toBeTruthy();
  });

  it('Does not post in Club 40 if member has fewer than 40 points', async () => {
    const mentionedMember = new GuildMember({ id: '1' });
    await awardPoints.cb({
      member: nonStaffAuthor,
      content: `${mentionedMember} ++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
      }),
    });

    expect(club40Channel.send).not.toHaveBeenCalled();
  });

  it('Does not post in Club 40 if member already has the role', async () => {
    const mentionedMember = new GuildMember({ id: '40' });
    mentionedMember.roles.cache.set(IDs.club40Role, { name: 'club-40' });
    await awardPoints.cb({
      member: nonStaffAuthor,
      content: `${mentionedMember} ++`,
      channel: generalChannel,
      client,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
      }),
    });

    expect(club40Channel.send).not.toHaveBeenCalled();
  });
});
