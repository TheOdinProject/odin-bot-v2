const { MessageFlags, PermissionFlagsBits } = require('discord.js');
const {
  Guild,
  GuildMember,
  TextChannel,
  Role,
  User,
} = require('../../test/mocks/discord');
const mockUsers = require('../../test/mocks/database-users/awarding-points');
const PointsService = require('./points.service');
const greatQuestion = require('../../bot-commands/slash/great-question');
const config = require('../../config');
const db = require('../../db');

const selfAwardGif = 'http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif';
const generalChannel = new TextChannel('000');
const club40Channel = new TextChannel(config.channels.club40ChannelId);
const noPointsChannel = new TextChannel(config.channels.noPointsChannelIds[0]);
const nobotRole = new Role(config.roles.NOBOTRoleId, 'NOBOT');
const club40Role = new Role(config.roles.club40Id, 'club-40');
const guild = new Guild({
  channels: [generalChannel, club40Channel, noPointsChannel],
  roles: [club40Role],
});

const author = new GuildMember({ id: '99999999' });

jest.mock('./club-40-gifs.json', () => [
  {
    gif: 'https://i.imgur.com/ofDEfYs.gif',
    author: 'Sully',
  },
]);

/**
 * Each recipient is either a GuildMember (in the server) or a User (not in the server),
 * filling the user, user2, user3... options in order.
 */
function createInteraction({
  member = author,
  channel = generalChannel,
  recipients = [],
}) {
  const getRecipient = (name) =>
    recipients[PointsService.USER_OPTION_NAMES.indexOf(name)];

  return {
    member,
    channel,
    guild,
    options: {
      getUser: (name) => {
        const recipient = getRecipient(name);
        return recipient instanceof GuildMember ? recipient.user : recipient;
      },
      getMember: (name) => {
        const recipient = getRecipient(name);
        return recipient instanceof GuildMember ? recipient : null;
      },
    },
    reply: jest.fn(),
    followUp: jest.fn(),
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

describe('/thanks', () => {
  it('Awards point to member without points', async () => {
    const recipient = new GuildMember({ id: '0' });
    const interaction = createInteraction({ recipients: [recipient] });

    await PointsService.awardPoints(interaction);

    expect(await getPoints('0')).toBe(1);
    expect(interaction.reply).toHaveBeenCalledWith(
      `Nice! ${recipient} now has 1 point`,
    );
  });

  it('Awards single point to member with points', async () => {
    const recipient = new GuildMember({ id: '1' });
    const interaction = createInteraction({ recipients: [recipient] });

    await PointsService.awardPoints(interaction);

    expect(await getPoints('1')).toBe(2);
    expect(interaction.reply).toHaveBeenCalledWith(
      `Nice! ${recipient} now has 2 points`,
    );
  });

  it('Awards single point to each of multiple members in one reply', async () => {
    const recipient1 = new GuildMember({ id: '1' });
    const recipient2 = new GuildMember({ id: '2' });
    const interaction = createInteraction({
      recipients: [recipient1, recipient2],
    });

    await PointsService.awardPoints(interaction);

    expect(await getPoints('1')).toBe(2);
    expect(await getPoints('2')).toBe(3);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith(
      `Nice! ${recipient1} now has 2 points\nNice! ${recipient2} now has 3 points`,
    );
  });

  it('Awards point only once for member given multiple times', async () => {
    const recipient = new GuildMember({ id: '1' });
    const interaction = createInteraction({
      recipients: [recipient, recipient],
    });

    await PointsService.awardPoints(interaction);

    expect(await getPoints('1')).toBe(2);
    expect(interaction.reply).toHaveBeenCalledWith(
      `Nice! ${recipient} now has 2 points`,
    );
  });

  it('Gives unique response when trying to award OdinBot', async () => {
    const interaction = createInteraction({
      recipients: [GuildMember.odinBot],
    });

    await PointsService.awardPoints(interaction);

    expect(await getPoints(config.botUserId)).toBeUndefined();
    expect(interaction.reply).toHaveBeenCalledWith(
      'Awwwww shucks... :heart_eyes:',
    );
  });

  it('Prevents self-awarding points', async () => {
    const interaction = createInteraction({ recipients: [author] });

    await PointsService.awardPoints(interaction);

    expect(await getPoints(author.id)).toBeUndefined();
    expect(interaction.reply).toHaveBeenCalledWith(
      `${selfAwardGif}\nYou can't give yourself points!`,
    );
  });

  it('Does not prevent awarding points to other members when also self-awarding', async () => {
    const recipient = new GuildMember({ id: '1' });
    const interaction = createInteraction({ recipients: [author, recipient] });

    await PointsService.awardPoints(interaction);

    expect(await getPoints(author.id)).toBeUndefined();
    expect(await getPoints('1')).toBe(2);
    expect(interaction.reply).toHaveBeenCalledWith(
      `${selfAwardGif}\nYou can't give yourself points!\nNice! ${recipient} now has 2 points`,
    );
  });

  it('Privately rejects other bots', async () => {
    const otherBot = new GuildMember({ id: '1' });
    otherBot.user.bot = true;
    const interaction = createInteraction({ recipients: [otherBot] });

    await PointsService.awardPoints(interaction);

    expect(await getPoints('1')).toBe(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: `${otherBot} is a bot, so can't be given points.`,
      flags: MessageFlags.Ephemeral,
    });
  });

  it('Privately rejects users who are not in the server', async () => {
    const leftUser = new User({ id: '1' });
    const interaction = createInteraction({ recipients: [leftUser] });

    await PointsService.awardPoints(interaction);

    expect(await getPoints('1')).toBe(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: `${leftUser} isn't in the server.`,
      flags: MessageFlags.Ephemeral,
    });
  });

  it('Awards valid members publicly and reports invalid ones privately', async () => {
    const recipient = new GuildMember({ id: '1' });
    const leftUser = new User({ id: '2' });
    const interaction = createInteraction({
      recipients: [recipient, leftUser],
    });

    await PointsService.awardPoints(interaction);

    expect(await getPoints('1')).toBe(2);
    expect(await getPoints('2')).toBe(2);
    expect(interaction.reply).toHaveBeenCalledWith(
      `Nice! ${recipient} now has 2 points`,
    );
    expect(interaction.followUp).toHaveBeenCalledWith({
      content: `${leftUser} isn't in the server.`,
      flags: MessageFlags.Ephemeral,
    });
  });

  it('Prevents awarding points in a no-points channel', async () => {
    const interaction = createInteraction({
      channel: noPointsChannel,
      recipients: [new GuildMember({ id: '1' })],
    });

    await PointsService.awardPoints(interaction);

    expect(await getPoints('1')).toBe(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: "You can't give points in this channel!",
      flags: MessageFlags.Ephemeral,
    });
  });

  it('Prevents NOBOT members from awarding points', async () => {
    const interaction = createInteraction({
      member: new GuildMember({ id: '99999998', roles: [nobotRole] }),
      recipients: [new GuildMember({ id: '1' })],
    });

    await PointsService.awardPoints(interaction);

    expect(await getPoints('1')).toBe(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: "You can't give points right now.",
      flags: MessageFlags.Ephemeral,
    });
  });
});

describe('/greatquestion', () => {
  it('Is only available to members who can manage messages', () => {
    expect(greatQuestion.data.default_member_permissions).toBe(
      PermissionFlagsBits.ManageMessages.toString(),
    );
  });

  it('Awards double points', async () => {
    const recipient = new GuildMember({ id: '1' });
    const interaction = createInteraction({ recipients: [recipient] });

    await PointsService.awardPoints(interaction, { isGreatQuestion: true });

    expect(await getPoints('1')).toBe(3);
    expect(interaction.reply).toHaveBeenCalledWith(
      `Thanks for the great question! ${recipient} now has 3 points`,
    );
  });
});

describe('Club 40', () => {
  const welcomeGifMessages = [
    ['https://i.imgur.com/ofDEfYs.gif'],
    ['Gif by Sully'],
  ];

  it('Adds member to Club 40 when given single point at 39 points', async () => {
    const recipient = new GuildMember({ id: '39' });

    await PointsService.awardPoints(
      createInteraction({ recipients: [recipient] }),
    );

    expect(club40Channel.send.mock.calls).toEqual([
      [
        `HEYYY EVERYONE SAY HI TO ${recipient} the newest member of CLUB 40! Please check the pins at the top right!`,
      ],
      ...welcomeGifMessages,
    ]);
    expect(recipient.roles.cache.get(config.roles.club40Id)).toBeTruthy();
  });

  it('Adds member to Club 40 when at 39 points then awarded double points', async () => {
    const recipient = new GuildMember({ id: '39' });

    await PointsService.awardPoints(
      createInteraction({ recipients: [recipient] }),
      { isGreatQuestion: true },
    );

    expect(club40Channel.send.mock.calls).toEqual([
      [
        `HEYYY EVERYONE SAY HI TO ${recipient} the newest member of CLUB 40! Please check the pins at the top right!`,
      ],
      ...welcomeGifMessages,
    ]);
    expect(recipient.roles.cache.get(config.roles.club40Id)).toBeTruthy();
  });

  it('Adds returning Club 40 member when awarded points', async () => {
    const recipient = new GuildMember({ id: '40' });

    await PointsService.awardPoints(
      createInteraction({ recipients: [recipient] }),
    );

    expect(club40Channel.send.mock.calls).toEqual([
      [
        `WELCOME BACK TO CLUB 40 ${recipient}!! Please review the pins at the top right!`,
      ],
      ...welcomeGifMessages,
    ]);
    expect(recipient.roles.cache.get(config.roles.club40Id)).toBeTruthy();
  });

  it('Does not post in Club 40 if member has fewer than 40 points', async () => {
    await PointsService.awardPoints(
      createInteraction({ recipients: [new GuildMember({ id: '1' })] }),
    );

    expect(club40Channel.send).not.toHaveBeenCalled();
  });

  it('Does not post in Club 40 if member already has the role', async () => {
    await PointsService.awardPoints(
      createInteraction({
        recipients: [new GuildMember({ id: '40', roles: [club40Role] })],
      }),
    );

    expect(club40Channel.send).not.toHaveBeenCalled();
  });

  it('Still awards points if adding the Club 40 role fails', async () => {
    const recipient = new GuildMember({ id: '39' });
    const error = new Error('Missing Access');
    Object.defineProperty(recipient, 'roles', {
      value: { cache: new Map(), add: jest.fn().mockRejectedValue(error) },
    });
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    const interaction = createInteraction({ recipients: [recipient] });

    await PointsService.awardPoints(interaction);

    expect(await getPoints('39')).toBe(40);
    expect(interaction.reply).toHaveBeenCalledWith(
      `Woot! ${recipient} now has 40 points`,
    );
    expect(consoleError).toHaveBeenCalledWith(error);
    consoleError.mockRestore();
  });
});
