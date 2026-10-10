const {
  Guild,
  GuildMember,
  TextChannel,
  Role,
  User,
} = require('../../test/mocks/discord');
const mockUsers = require('../../test/mocks/database-users/awarding-points');
const PointsService = require('./points.service');
const config = require('../../config');
const db = require('../../db');

// The ++ / ?++ tests in bot-commands/points/award-points.test.js cover the rules shared with
// the inline commands (self-awards, OdinBot, limits, double points, Club 40).
// These cover the slash command path and the checks the inline tests don't.

const generalChannel = new TextChannel('000');
const club40Channel = new TextChannel(config.channels.club40ChannelId);
const coreRole = new Role(1, 'core');
const nobotRole = new Role(config.roles.NOBOTRoleId, 'NOBOT');
const club40Role = new Role(config.roles.club40Id, 'club-40');

const author = new GuildMember({ id: '99999999' });
const staffAuthor = new GuildMember({ id: '0000000', roles: [coreRole] });

jest.mock('./club-40-gifs.json', () => [
  {
    gif: 'https://i.imgur.com/ofDEfYs.gif',
    author: 'Sully',
  },
]);

function createGuild(members) {
  return new Guild({
    members,
    channels: [generalChannel, club40Channel],
    roles: [coreRole, club40Role],
  });
}

// Users fill the user, user2, user3... options in order
function createInteraction({ member = author, users = [], guild }) {
  return {
    member,
    channel: generalChannel,
    guild: guild ?? createGuild([member]),
    options: {
      getUser: (name) => users[PointsService.USER_OPTION_NAMES.indexOf(name)],
    },
    deferReply: jest.fn(),
    editReply: jest.fn(),
  };
}

async function getPoints(id) {
  const { rows } = await db.query(
    'SELECT points FROM points WHERE discord_id = $1;',
    [id],
  );
  return rows[0]?.points;
}

beforeEach(async () => {
  await db.query('TRUNCATE points;');
  await db.query(
    `INSERT INTO points SELECT * FROM unnest($1::text[], $2::integer[]);`,
    [mockUsers.map((user) => user.id), mockUsers.map((user) => user.points)],
  );
  jest.clearAllMocks();
});

afterAll(async () => {
  await db.end();
});

describe('/thanks and /greatquestion', () => {
  it('Defers, then replies with the award message', async () => {
    const recipient = new GuildMember({ id: '1' });
    const interaction = createInteraction({
      users: [recipient.user],
      guild: createGuild([author, recipient]),
    });

    await PointsService.awardFromInteraction(interaction, { points: 1 });

    expect(await getPoints('1')).toBe(2);
    expect(interaction.deferReply).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith(
      `Nice! ${recipient} now has 2 points`,
    );
  });

  it('Awards everyone given in the user options in one message', async () => {
    const recipient1 = new GuildMember({ id: '1' });
    const recipient2 = new GuildMember({ id: '2' });
    const interaction = createInteraction({
      users: [recipient1.user, recipient2.user],
      guild: createGuild([author, recipient1, recipient2]),
    });

    await PointsService.awardFromInteraction(interaction, { points: 1 });

    expect(interaction.editReply).toHaveBeenCalledWith(
      `Nice! ${recipient1} now has 2 points\nNice! ${recipient2} now has 3 points`,
    );
  });

  it('Awards double points', async () => {
    const recipient = new GuildMember({ id: '1' });
    const interaction = createInteraction({
      member: staffAuthor,
      users: [recipient.user],
      guild: createGuild([staffAuthor, recipient]),
    });

    await PointsService.awardFromInteraction(interaction, { points: 2 });

    expect(await getPoints('1')).toBe(3);
    expect(interaction.editReply).toHaveBeenCalledWith(
      `Thanks for the great question! ${recipient} now has 3 points`,
    );
  });

  it('Replies with an error message if awarding fails', async () => {
    const error = new Error('Database is down');
    const award = jest.spyOn(PointsService, 'award').mockRejectedValue(error);
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    const interaction = createInteraction({ users: [new User({ id: '1' })] });

    await PointsService.awardFromInteraction(interaction, { points: 1 });

    expect(consoleError).toHaveBeenCalledWith(error);
    expect(interaction.editReply).toHaveBeenCalledWith(
      'There was an error while executing this command!',
    );
    award.mockRestore();
    consoleError.mockRestore();
  });
});

describe('award', () => {
  it('Does not award users who are not in the server', async () => {
    const message = await PointsService.award({
      giver: author,
      channel: generalChannel,
      guild: createGuild([author]),
      awards: [{ userId: '1', points: 1 }],
    });

    expect(await getPoints('1')).toBe(1);
    expect(message).toBe("<@1> isn't in the server.");
  });

  it('Does not award bots other than OdinBot', async () => {
    const otherBot = new GuildMember({ id: '1' });
    otherBot.user.bot = true;

    const message = await PointsService.award({
      giver: author,
      channel: generalChannel,
      guild: createGuild([author, otherBot]),
      awards: [{ userId: '1', points: 1 }],
    });

    expect(await getPoints('1')).toBe(1);
    expect(message).toBe(`${otherBot} is a bot, so can't be given points.`);
  });

  it('Prevents NOBOT members from awarding points', async () => {
    const nobotAuthor = new GuildMember({ id: '99999998', roles: [nobotRole] });
    const recipient = new GuildMember({ id: '1' });

    const message = await PointsService.award({
      giver: nobotAuthor,
      channel: generalChannel,
      guild: createGuild([nobotAuthor, recipient]),
      awards: [{ userId: '1', points: 1 }],
    });

    expect(await getPoints('1')).toBe(1);
    expect(message).toBe("You can't give points right now.");
  });

  it('Still gives a single point when a non-staff member also tries double points', async () => {
    const recipient = new GuildMember({ id: '1' });

    const message = await PointsService.award({
      giver: author,
      channel: generalChannel,
      guild: createGuild([author, recipient]),
      awards: [
        { userId: '1', points: 2 },
        { userId: '1', points: 1 },
      ],
    });

    expect(await getPoints('1')).toBe(2);
    expect(message).toBe(
      `Only staff can give double points!\nNice! ${recipient} now has 2 points`,
    );
  });

  it('Welcomes a new Club 40 member who reaches 40 from 38 with double points', async () => {
    await db.query("INSERT INTO points VALUES ('38', 38);");
    const recipient = new GuildMember({ id: '38' });

    await PointsService.award({
      giver: staffAuthor,
      channel: generalChannel,
      guild: createGuild([staffAuthor, recipient]),
      awards: [{ userId: '38', points: 2 }],
    });

    expect(club40Channel.send).toHaveBeenCalledWith(
      `HEYYY EVERYONE SAY HI TO ${recipient} the newest member of CLUB 40! Please check the pins at the top right!`,
    );
  });

  it('Still awards points if adding the Club 40 role fails', async () => {
    const recipient = new GuildMember({ id: '39' });
    const error = new Error('Missing Access');
    Object.defineProperty(recipient, 'roles', {
      value: { cache: new Map(), add: jest.fn().mockRejectedValue(error) },
    });
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    const message = await PointsService.award({
      giver: author,
      channel: generalChannel,
      guild: createGuild([author, recipient]),
      awards: [{ userId: '39', points: 1 }],
    });

    expect(await getPoints('39')).toBe(40);
    expect(message).toBe(`Woot! ${recipient} now has 40 points`);
    expect(consoleError).toHaveBeenCalledWith(error);
    consoleError.mockRestore();
  });
});
