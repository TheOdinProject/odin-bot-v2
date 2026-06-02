const {
  Guild,
  GuildMember,
  TextChannel,
  Role,
} = require('../../utils/mocks/discord');
const awardPoints = require('./award-points-pg');
const config = require('../../config');
const db = require('../../db');
const mockUsers = require('../../utils/mocks/database-users/awarding-points');

const selfAwardGif = 'http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif';
const generalChannel = new TextChannel('000');
const club40Channel = new TextChannel(config.channels.club40ChannelId);
const noPointsChannel = new TextChannel(config.channels.noPointsChannelIds[0]);
const channels = [generalChannel, club40Channel, noPointsChannel];

jest.mock('./club-40-gifs.json', () => [
  {
    gif: 'https://i.imgur.com/ofDEfYs.gif',
    author: 'Sully',
  },
]);

beforeEach(async () => {
  const initialDbState = [
    mockUsers.map((user) => user.id),
    mockUsers.map((user) => user.points),
  ];
  await db.query('TRUNCATE points;');
  await db.query(
    `INSERT INTO points SELECT * FROM unnest($1::text[], $2::integer[]);`,
    initialDbState,
  );
  jest.clearAllMocks();
});

afterAll(async () => {
  await db.end();
});

describe('++ / :star:', () => {
  const author = new GuildMember({ id: '99999999' });

  it('Awards point to different member without points', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: author,
      content: `${mentionedMember} ++`,
      channel: generalChannel,
      guild: new Guild({
        members: [author, mentionedMember],
        channels,
      }),
    });

    const result = await db.query(
      "SELECT points FROM points WHERE discord_id = '0';",
    );
    expect(result.rows).toEqual([{ points: 1 }]);
    expect(generalChannel.send.mock.calls).toEqual([
      [`Nice! ${mentionedMember} now has 1 point`],
    ]);
  });

  it('Awards single point to different member with points', async () => {
    const mentionedMember = new GuildMember({ id: '1' });
    await awardPoints.cb({
      member: author,
      content: `${mentionedMember} ++`,
      channel: generalChannel,
      guild: new Guild({
        members: [author, mentionedMember],
        channels,
      }),
    });

    const result = await db.query(
      "SELECT points FROM points WHERE discord_id = '1';",
    );
    expect(result.rows).toEqual([{ points: 2 }]);
    expect(generalChannel.send.mock.calls).toEqual([
      [`Nice! ${mentionedMember} now has 2 points`],
    ]);
  });

  it('Awards single point to each of multiple different mentioned members', async () => {
    const mentionedMember1 = new GuildMember({ id: '1' });
    const mentionedMember2 = new GuildMember({ id: '2' });
    await awardPoints.cb({
      member: author,
      content: `${mentionedMember1} ++ ${mentionedMember2} ++`,
      channel: generalChannel,
      guild: new Guild({
        members: [author, mentionedMember1, mentionedMember2],
        channels,
      }),
    });

    const result = await db.query(
      "SELECT points FROM points WHERE discord_id IN ('1', '2');",
    );
    expect(result.rows).toEqual([{ points: 2 }, { points: 3 }]);
    expect(generalChannel.send.mock.calls).toEqual([
      [`Nice! ${mentionedMember1} now has 2 points`],
      [`Nice! ${mentionedMember2} now has 3 points`],
    ]);
  });

  it('Awards point only once for member mentioned multiple times', async () => {
    const mentionedMember = new GuildMember({ id: '1' });
    await awardPoints.cb({
      member: author,
      content: `${mentionedMember} ++ ${mentionedMember} ++`,
      channel: generalChannel,
      guild: new Guild({
        members: [author, mentionedMember],
        channels,
      }),
    });

    const result = await db.query(
      "SELECT points FROM points WHERE discord_id = '1';",
    );
    expect(result.rows).toEqual([{ points: 2 }]);
    expect(generalChannel.send.mock.calls).toEqual([
      [`Nice! ${mentionedMember} now has 2 points`],
    ]);
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
      guild: new Guild({
        members: [author, ...mentionedMembers],
        channels,
      }),
    });

    const result = await db.query(
      `
      SELECT points FROM points
      WHERE discord_id IN ('1', '2', '3', '4', '5', '6');
      `,
    );
    expect(result.rows).toEqual([
      { points: 2 },
      { points: 3 },
      { points: 4 },
      { points: 5 },
      { points: 6 },
      { points: 6 }, // points unchanged!
    ]);
    expect(generalChannel.send.mock.calls).toEqual([
      ['You can only do up to 5 users at a time...'],
      [`Nice! ${mentionedMembers[0]} now has 2 points`],
      [`Nice! ${mentionedMembers[1]} now has 3 points`],
      [`Nice! ${mentionedMembers[2]} now has 4 points`],
      [`Sweet! ${mentionedMembers[3]} now has 5 points`],
      [`Sweet! ${mentionedMembers[4]} now has 6 points`],
    ]);
  });

  it('Gives unique response when trying to award OdinBot', async () => {
    await awardPoints.cb({
      member: author,
      content: `${GuildMember.odinBot} ++`,
      channel: generalChannel,
      guild: new Guild({ members: [author], channels }),
    });

    const result = await db.query(
      'SELECT points FROM points WHERE discord_id = $1;',
      [GuildMember.odinBot.id],
    );
    expect(result.rows).toEqual([]);
    expect(generalChannel.send.mock.calls).toEqual([
      ['Awwwww shucks... :heart_eyes:'],
    ]);
  });

  it('Prevents awarding points in a no-points channel', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: author,
      content: `${mentionedMember} ++`,
      channel: noPointsChannel,
      guild: new Guild({
        members: [author, mentionedMember],
        channels,
      }),
    });

    const result = await db.query(
      "SELECT points FROM points WHERE discord_id = '0';",
    );
    expect(result.rows).toEqual([]);
    expect(noPointsChannel.send.mock.calls).toEqual([
      ["You can't give points in this channel!"],
    ]);
  });

  it('Prevents self-awarding points', async () => {
    await awardPoints.cb({
      member: author,
      content: `${author} ++`,
      channel: generalChannel,
      guild: new Guild({ members: [author], channels }),
    });

    const result = await db.query(
      'SELECT points FROM points WHERE discord_id = $1;',
      [author.id],
    );
    expect(result.rows).toEqual([]);
    expect(generalChannel.send.mock.calls).toEqual([
      [selfAwardGif],
      ["You can't give yourself points!"],
    ]);
  });

  it('Does not prevent awarding points to other members when also self-awarding', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: author,
      content: `${author} ++ ${mentionedMember} ++`,
      channel: generalChannel,
      guild: new Guild({ members: [author, mentionedMember], channels }),
    });

    const ownAwardResult = await db.query(
      'SELECT points FROM points WHERE discord_id = $1;',
      [author.id],
    );
    const otherAwardResult = await db.query(
      "SELECT points FROM points WHERE discord_id = '0';",
    );

    expect(ownAwardResult.rows).toEqual([]);
    expect(otherAwardResult.rows).toEqual([{ points: 1 }]);
    expect(generalChannel.send.mock.calls).toEqual([
      [selfAwardGif],
      ["You can't give yourself points!"],
      [`Nice! ${mentionedMember} now has 1 point`],
    ]);
  });

  it('Does not include self-awards in 5 award limit', async () => {
    const mentionedMembers = [
      new GuildMember({ id: '1' }),
      new GuildMember({ id: '2' }),
      new GuildMember({ id: '3' }),
      new GuildMember({ id: '4' }),
      new GuildMember({ id: '5' }),
    ];
    await awardPoints.cb({
      member: author,
      content: `${author} ++ ${mentionedMembers[0]} ++ ${mentionedMembers[1]} ++ ${mentionedMembers[2]} ++ ${mentionedMembers[3]} ++ ${mentionedMembers[4]} ++ ${mentionedMembers[5]} ++`,
      channel: generalChannel,
      guild: new Guild({
        members: [author, ...mentionedMembers],
        channels,
      }),
    });

    const result = await db.query(
      `
      SELECT points FROM points
      WHERE discord_id IN ($1, '1', '2', '3', '4', '5');
      `,
      [author.id],
    );
    expect(result.rows).toEqual([
      { points: 2 },
      { points: 3 },
      { points: 4 },
      { points: 5 },
      { points: 6 },
    ]);
    expect(generalChannel.send.mock.calls).toEqual([
      [selfAwardGif],
      ["You can't give yourself points!"],
      [`Nice! ${mentionedMembers[0]} now has 2 points`],
      [`Nice! ${mentionedMembers[1]} now has 3 points`],
      [`Nice! ${mentionedMembers[2]} now has 4 points`],
      [`Sweet! ${mentionedMembers[3]} now has 5 points`],
      [`Sweet! ${mentionedMembers[4]} now has 6 points`],
    ]);
  });
});

describe('?++', () => {
  const nonStaffAuthor = new GuildMember({ id: '99999999' });
  const staffAuthor = new GuildMember({
    id: '0000000',
    roles: [new Role(1, 'core')],
  });

  it('Prevents awarding points if author is not staff member', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: nonStaffAuthor,
      content: `${mentionedMember} ?++`,
      channel: generalChannel,
      guild: new Guild({
        members: [nonStaffAuthor, mentionedMember],
        channels,
      }),
    });

    const result = await db.query(
      "SELECT points FROM points WHERE discord_id = '0';",
    );
    expect(result.rows).toEqual([]);
    expect(generalChannel.send.mock.calls).toEqual([
      ['Only staff can use ?++ to give double points!'],
    ]);
  });

  it('Awards double points to different member if author is staff member', async () => {
    const mentionedMember = new GuildMember({ id: '1' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember} ?++`,
      channel: generalChannel,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
      }),
    });

    const result = await db.query(
      "SELECT points FROM points WHERE discord_id = '1';",
    );
    expect(result.rows).toEqual([{ points: 3 }]);
    expect(generalChannel.send.mock.calls).toEqual([
      [`Thanks for the great question! ${mentionedMember} now has 3 points`],
    ]);
  });

  it('Awards double points to each of multiple different mentioned members', async () => {
    const mentionedMember1 = new GuildMember({ id: '1' });
    const mentionedMember2 = new GuildMember({ id: '2' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember1} ?++ ${mentionedMember2} ?++`,
      channel: generalChannel,
      guild: new Guild({
        members: [staffAuthor, mentionedMember1, mentionedMember2],
        channels,
      }),
    });

    const result = await db.query(
      "SELECT points FROM points WHERE discord_id IN('1', '2');",
    );
    expect(result.rows).toEqual([{ points: 3 }, { points: 4 }]);
    expect(generalChannel.send.mock.calls).toEqual([
      [`Thanks for the great question! ${mentionedMember1} now has 3 points`],
      [`Thanks for the great question! ${mentionedMember2} now has 4 points`],
    ]);
  });

  it('Awards points only once for member mentioned multiple times', async () => {
    const mentionedMember = new GuildMember({ id: '1' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember} ?++ ${mentionedMember} ?++`,
      channel: generalChannel,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
      }),
    });

    const result = await db.query(
      "SELECT points FROM points WHERE discord_id = '1';",
    );
    expect(result.rows).toEqual([{ points: 3 }]);
    expect(generalChannel.send.mock.calls).toEqual([
      [`Thanks for the great question! ${mentionedMember} now has 3 points`],
    ]);
  });

  it('Gives unique response when trying to award OdinBot', async () => {
    await awardPoints.cb({
      member: staffAuthor,
      content: `${GuildMember.odinBot} ?++`,
      channel: generalChannel,
      guild: new Guild({ members: [staffAuthor], channels }),
    });

    const result = await db.query(
      'SELECT points FROM points WHERE discord_id = $1;',
      [GuildMember.odinBot.id],
    );
    expect(result.rows).toEqual([]);
    expect(generalChannel.send.mock.calls).toEqual([
      ['Awwwww shucks... :heart_eyes:'],
    ]);
  });

  it('Prevents awarding points in a no-points channel', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember} ?++`,
      channel: noPointsChannel,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
      }),
    });

    const result = await db.query(
      "SELECT points FROM points WHERE discord_id = '0';",
    );
    expect(result.rows).toEqual([]);
    expect(noPointsChannel.send.mock.calls).toEqual([
      ["You can't give points in this channel!"],
    ]);
  });

  it('Prevents self-awarding points', async () => {
    await awardPoints.cb({
      member: staffAuthor,
      content: `${staffAuthor} ?++`,
      channel: generalChannel,
      guild: new Guild({ members: [staffAuthor], channels }),
    });

    const result = await db.query(
      'SELECT points FROM points WHERE discord_id = $1;',
      [staffAuthor.id],
    );
    expect(result.rows).toEqual([]);
    expect(generalChannel.send.mock.calls).toEqual([
      [selfAwardGif],
      ["You can't give yourself points!"],
    ]);
  });

  it('Does not prevent awarding points to other members when also self-awarding', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${staffAuthor} ?++ ${mentionedMember} ?++`,
      channel: generalChannel,
      guild: new Guild({ members: [staffAuthor, mentionedMember], channels }),
    });

    const result = await db.query(
      "SELECT points FROM points WHERE discord_id = '0';",
    );
    expect(result.rows).toEqual([{ points: 2 }]);
    expect(generalChannel.send.mock.calls).toEqual([
      [selfAwardGif],
      ["You can't give yourself points!"],
      [`Thanks for the great question! ${mentionedMember} now has 2 points`],
    ]);
  });

  it('Only uses the ?++ exclamation for ?++ awards (inc. mixed awards)', async () => {
    const mentionedMember1 = new GuildMember({ id: '1' });
    const mentionedMember2 = new GuildMember({ id: '2' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember1} ?++ ${mentionedMember2} ++`,
      channel: generalChannel,
      guild: new Guild({
        members: [staffAuthor, mentionedMember1, mentionedMember2],
        channels,
      }),
    });

    const result = await db.query(
      "SELECT points FROM points WHERE discord_id IN ('1', '2');",
    );
    expect(result.rows).toEqual([{ points: 3 }, { points: 3 }]);
    expect(generalChannel.send.mock.calls).toEqual([
      [`Thanks for the great question! ${mentionedMember1} now has 3 points`],
      [`Nice! ${mentionedMember2} now has 3 points`],
    ]);
  });

  it('Prioritizes double points if same member given mixed awards in the same message', async () => {
    const mentionedMember = new GuildMember({ id: '0' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember} ?++ ${mentionedMember} ?++`,
      channel: generalChannel,
      guild: new Guild({ members: [staffAuthor, mentionedMember], channels }),
    });

    const result = await db.query(
      "SELECT points FROM points WHERE discord_id = '0';",
    );
    expect(result.rows).toEqual([{ points: 2 }]);
    expect(generalChannel.send.mock.calls).toEqual([
      [`Thanks for the great question! ${mentionedMember} now has 2 points`],
    ]);
  });
});

describe('Club 40', () => {
  const nonStaffAuthor = new GuildMember({ id: '99999999' });
  const staffAuthor = new GuildMember({
    id: '0000000',
    roles: [new Role(0, 'core')],
  });
  const club40Role = new Role(config.roles.club40Id, 'club-40');

  it('Adds member to Club 40 when given single point at 39 points', async () => {
    const mentionedMember = new GuildMember({ id: '39' });
    await awardPoints.cb({
      member: nonStaffAuthor,
      content: `${mentionedMember} ++`,
      channel: generalChannel,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
        roles: [club40Role],
      }),
    });

    expect(club40Channel.send.mock.calls).toEqual([
      [
        `HEYYY EVERYONE SAY HI TO ${mentionedMember} the newest member of CLUB 40! Please check the pins at the top right!`,
      ],
      ['https://i.imgur.com/ofDEfYs.gif'],
      ['Gif by Sully'],
    ]);
    expect(mentionedMember.roles.cache.get(config.roles.club40Id)).toBeTruthy();
  });

  it('Adds member to Club 40 when at 39 points then awarded double points', async () => {
    const mentionedMember = new GuildMember({ id: '39' });
    await awardPoints.cb({
      member: staffAuthor,
      content: `${mentionedMember} ?++`,
      channel: generalChannel,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
        roles: [club40Role],
      }),
    });

    expect(club40Channel.send.mock.calls).toEqual([
      [
        `HEYYY EVERYONE SAY HI TO ${mentionedMember} the newest member of CLUB 40! Please check the pins at the top right!`,
      ],
      ['https://i.imgur.com/ofDEfYs.gif'],
      ['Gif by Sully'],
    ]);
    expect(mentionedMember.roles.cache.get(config.roles.club40Id)).toBeTruthy();
  });

  it('Adds returning Club 40 member when awarded points', async () => {
    const mentionedMember = new GuildMember({ id: '40' });
    await awardPoints.cb({
      member: nonStaffAuthor,
      content: `${mentionedMember} ++`,
      channel: generalChannel,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
        roles: [club40Role],
      }),
    });

    expect(club40Channel.send.mock.calls).toEqual([
      [
        `WELCOME BACK TO CLUB 40 ${mentionedMember}!! Please review the pins at the top right!`,
      ],
      ['https://i.imgur.com/ofDEfYs.gif'],
      ['Gif by Sully'],
    ]);
    expect(mentionedMember.roles.cache.get(config.roles.club40Id)).toBeTruthy();
  });

  it('Does not post in Club 40 if member has fewer than 40 points', async () => {
    const mentionedMember = new GuildMember({ id: '1' });
    await awardPoints.cb({
      member: nonStaffAuthor,
      content: `${mentionedMember} ++`,
      channel: generalChannel,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
        roles: [club40Role],
      }),
    });

    expect(club40Channel.send).not.toHaveBeenCalled();
  });

  it('Does not post in Club 40 if member already has the role', async () => {
    const mentionedMember = new GuildMember({
      id: '40',
      roles: [club40Role],
    });
    await awardPoints.cb({
      member: nonStaffAuthor,
      content: `${mentionedMember} ++`,
      channel: generalChannel,
      guild: new Guild({
        members: [staffAuthor, mentionedMember],
        channels,
        roles: [club40Role],
      }),
    });

    expect(club40Channel.send).not.toHaveBeenCalled();
  });
});
