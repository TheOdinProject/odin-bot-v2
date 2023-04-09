const axios = require('axios');
const {
  Guild, Channel, Client, User, Member,
} = require('discord.js');
const commands = require('./points');

axios.post = jest.fn();

const mockSend = jest.fn();
mockSend.mockImplementation((message) => message);

const gifContainer = [
  {
    gif: 'https://i.imgur.com/ofDEfYs.gif',
    author: 'Sully',
  },
];

jest.mock('./club_40_gifs.json', () => gifContainer);

jest.mock('../botEngine.js', () => ({
  registerBotCommand: jest.fn(),
}));

jest.mock('discord.js', () => ({
  Client: jest.fn().mockImplementation((users, channel, user) => ({
    channels: {
      cache: {
        get: () => channel,
      },
    },
    users: {
      cache: {
        get: (userId) => users.filter((filteredUser) => `<@${userId}>` === filteredUser.id)[0],
      },
    },
    user,
  })),

  Guild: jest.fn().mockImplementation((users) => ({
    members: {
      members: users,
      cache: {
        get: (id) => users.filter((member) => member.discord_id === id)[0],
      },
      fetch: jest.fn().mockImplementation((user) => user),
    },
    roles: {
      cache: [{ name: 'club-40' }],
    },
    member: (user) => users.filter((member) => member === user)[0],
  })),

  Channel: jest.fn().mockImplementation((id) => ({
    id,
    send: mockSend,
  })),

  User: jest.fn().mockImplementation((roles, id, points) => ({
    roles: {
      add: () => {
        roles.push('club-40');
      },
      cache: roles,
    },
    id: `<@${id}>`,
    points,
    toString: () => `<@${id}>`,
  })),

  Member: jest.fn().mockImplementation((roles) => ({
    roles: {
      cache: roles,
    },
  })),
}));

beforeEach(() => {
  axios.post.mockClear();
  mockSend.mockClear();
  User.mockClear();
});

describe('award points', () => {
  describe('regex ++', () => {
    it.each([
      ['<@!123456789> ++'],
      ['<@!123456789> +++'],
      ['<@!123456789> ++++++++++++'],
      ['thanks <@!123456789> ++'],
    ])("%s' - triggers the callback", (string) => {
      expect(string.match(commands.awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['++'],
      [''],
      [' '],
      [' /'],
      ['odin-bot++'],
      ['/++'],
      ['```function("<@!123456789> ++", () => {}```'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(string.match(commands.awardPoints.regex)).toBeFalsy();
    });

    it.each([
      ['Check this out! <@!123456789> ++'],
      ["Don't worry about it <@!123456789> ++"],
      ['Hey <@!123456789> ++'],
      ['/ <@!123456789> ++ ^ /me /leaderboard /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(string.match(commands.awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['@user/ ++'],
      ["it's about/<@!123456789> ++"],
      ['<@!123456789> ++isanillusion'],
      ['<@!123456789> ++/'],
      ['<@!123456789> ++*'],
      ['<@!123456789> ++...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(string.match(commands.awardPoints.regex)).toBeFalsy();
      },
    );
  });

  describe('regex ?++', () => {
    it.each([
      ['<@!123456789> ?++'],
      ['<@!123456789> ?+++'],
      ['<@!123456789> ?++++++++++++'],
      ['thanks <@!123456789> ?++'],
    ])("%s' - triggers the callback", (string) => {
      expect(string.match(commands.awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['?++'],
      [''],
      [' '],
      [' /'],
      ['odin-bot?++'],
      ['/?++'],
      ['```function("<@!123456789> ?++", () => {}```'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(string.match(commands.awardPoints.regex)).toBeFalsy();
    });

    it.each([
      ['Check this out! <@!123456789> ?++'],
      ["Don't worry about it <@!123456789> ?++"],
      ['Hey <@!123456789> ?++'],
      ['/ <@!123456789> ?++ ^ /me /leaderboard /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(string.match(commands.awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['@user/ ?++'],
      ["it's about/<@!123456789> ?++"],
      ['<@!123456789> ?++isanillusion'],
      ['<@!123456789> ?++/'],
      ['<@!123456789> ?++*'],
      ['<@!123456789> ?++...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(string.match(commands.awardPoints.regex)).toBeFalsy();
      },
    );
  });

  describe('regex ⭐', () => {
    it.each([['<@!123456789> ⭐'], ['thanks <@!123456789> ⭐']])(
      "'%s' - correct strings trigger the callback",
      (string) => {
        expect(string.match(commands.awardPoints.regex)).toBeTruthy();
      },
    );

    it.each([
      ['⭐'],
      [''],
      [' '],
      [' /'],
      ['odin-bot⭐'],
      ['/⭐'],
      ['```function("<@!123456789> ⭐", () => {}```'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(string.match(commands.awardPoints.regex)).toBeFalsy();
    });

    it.each([
      ['Check this out! <@!123456789> ⭐'],
      ["Don't worry about it <@!123456789> ⭐"],
      ['Hey <@!123456789> ⭐'],
      ['/ <@!123456789> ⭐ ^ /me /leaderboard /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(string.match(commands.awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['@user/++'],
      ["it's about/<@!123456789> ⭐"],
      ['<@!123456789> ⭐isanillusion'],
      ['<@!123456789> ⭐/'],
      ['<@!123456789> ⭐*'],
      ['<@!123456789> ⭐...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(string.match(commands.awardPoints.regex)).toBeFalsy();
      },
    );
  });
});

describe('callback', () => {
  const author = User([], 1, 10);
  const channel = Channel();

  it('returns correct output for a single user w/o club-40', async () => {
    const mentionedUser = User([], 2, 20);
    // users must be passed in as an array
    const client = Client([author, mentionedUser], channel);
    const data = {
      author,
      content: `${mentionedUser.id} ++`,
      channel,
      client,
      guild: Guild([author, mentionedUser]),
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: (mentionedUser.points += 1),
      },
    });

    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a single user entering club-40', async () => {
    const mentionedUser = User([], 2, 39);
    const client = Client([author, mentionedUser], channel);
    const data = {
      author,
      content: `${mentionedUser.id} ++`,
      channel,
      client,
      guild: Guild([author, mentionedUser]),
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: (mentionedUser.points += 1),
      },
    });

    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
  });

  it('returns correct output for a single user re-entering club-40', async () => {
    const mentionedUser = User([], 2, 40);
    const client = Client([author, mentionedUser], channel);
    const data = {
      author,
      content: `${mentionedUser.id} ++`,
      channel,
      client,
      guild: Guild([author, mentionedUser]),
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: (mentionedUser.points += 1),
      },
    });

    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
  });

  it('returns correct output for up to five mentioned users', async () => {
    const mentionedUser1 = User([], 2, 33);
    const mentionedUser2 = User([], 3, 21);
    const mentionedUser3 = User([], 4, 2);
    const mentionedUser4 = User([], 5, 0);
    const client = Client(
      [
        author,
        mentionedUser1,
        mentionedUser2,
        mentionedUser3,
        mentionedUser4,
      ],
      channel,
    );

    const data = {
      author,
      content: `${mentionedUser1.id} ++ ${mentionedUser2.id} ++ ${mentionedUser3.id} ++ ${mentionedUser4.id} ++`,
      channel,
      client,
      guild: Guild([
        author,
        mentionedUser1,
        mentionedUser2,
        mentionedUser3,
        mentionedUser4,
      ]),
    };

    axios.post
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser1,
          points: (mentionedUser1.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser2,
          points: (mentionedUser2.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser3,
          points: (mentionedUser3.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser4,
          points: (mentionedUser4.points += 1),
        },
      });

    await commands.awardPoints.cb(data);

    expect(data.channel.send).toHaveBeenCalledTimes(4);
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
  });

  describe('where one user is mentioned more than once', () => {
    it('returns correct output for only 1 user mentioned twice', async () => {
      const mentionedUser1 = User([], 2, 5);
      const client = Client(
        [
          author,
          mentionedUser1,
        ],
        channel,
      );
      const data = {
        author,
        content: `${mentionedUser1.id} ++ ${mentionedUser1.id} ++`,
        channel,
        client,
        guild: Guild([
          author,
          mentionedUser1,
        ]),
      };

      axios.post
        .mockResolvedValueOnce({
          data: {
            ...mentionedUser1,
            points: (mentionedUser1.points += 1),
          },
        });

      await commands.awardPoints.cb(data);

      expect(data.channel.send).toHaveBeenCalledTimes(2);
      expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    });

    it('returns correct output for only 1 user mentioned more than 5 times', async () => {
      const mentionedUser1 = User([], 2, 5);
      const client = Client(
        [
          author,
          mentionedUser1,
        ],
        channel,
      );

      const data = {
        author,
        content: `${mentionedUser1.id} ++ ${mentionedUser1.id} ++ ${mentionedUser1.id} ++ ${mentionedUser1.id} ++ ${mentionedUser1.id} ++ ${mentionedUser1.id} ++`,
        channel,
        client,
        guild: Guild([
          author,
          mentionedUser1,
        ]),
      };

      axios.post
        .mockResolvedValueOnce({
          data: {
            ...mentionedUser1,
            points: (mentionedUser1.points += 1),
          },
        });

      await commands.awardPoints.cb(data);

      expect(data.channel.send).toHaveBeenCalledTimes(6);
      expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[4][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[5][0]).toMatchSnapshot();
    });

    it('returns correct output for 1 user mentioned more than once with another user', async () => {
      const mentionedUser1 = User([], 2, 21);
      const mentionedUser2 = User([], 3, 23);
      const client = Client(
        [
          author,
          mentionedUser1,
        ],
        channel,
      );

      const data = {
        author,
        content: `${mentionedUser1.id} ++ ${mentionedUser1.id} ++ ${mentionedUser2.id} ++`,
        channel,
        client,
        guild: Guild([
          author,
          mentionedUser1,
        ]),
      };

      axios.post
        .mockResolvedValueOnce({
          data: {
            ...mentionedUser1,
            points: (mentionedUser1.points += 1),
          },
        })
        .mockResolvedValueOnce({
          data: {
            ...mentionedUser2,
            points: (mentionedUser2.points += 1),
          },
        });

      await commands.awardPoints.cb(data);

      expect(data.channel.send).toHaveBeenCalledTimes(3);
      expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    });
  });

  it('returns correct output for more than five mentioned users', async () => {
    const mentionedUser1 = User([], 2, 10);
    const mentionedUser2 = User([], 3, 3);
    const mentionedUser3 = User([], 4, 1);
    const mentionedUser4 = User([], 5, 0);
    const mentionedUser5 = User([], 6, 21);
    const client = Client(
      [
        author,
        mentionedUser1,
        mentionedUser2,
        mentionedUser3,
        mentionedUser4,
        mentionedUser5,
      ],
      channel,
    );

    const data = {
      author,
      content: `${mentionedUser1.id} ++ ${mentionedUser2.id} ++ ${mentionedUser3.id} ++ ${mentionedUser4.id} ++ ${mentionedUser5.id} ++`,
      channel,
      client,
      guild: Guild([
        author,
        mentionedUser1,
        mentionedUser2,
        mentionedUser3,
        mentionedUser4,
        mentionedUser5,
      ]),
    };

    axios.post
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser1,
          points: (mentionedUser1.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser2,
          points: (mentionedUser2.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser3,
          points: (mentionedUser3.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser4,
          points: (mentionedUser4.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser5,
          points: (mentionedUser5.points += 1),
        },
      });
    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalledTimes(6);
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[4][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[5][0]).toMatchSnapshot();
  });

  it('returns correct output for a user mentioning themselves', async () => {
    const client = Client([author], channel);
    const data = {
      author,
      content: `${author.id} ++`,
      channel,
      client,
      guild: Guild([author]),
    };

    axios.post.mockResolvedValue({
      data: {
        ...author,
        points: (author.points += 1),
      },
    });

    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
  });

  it('returns correct output for a user mentioning Odin Bot', async () => {
    const odinBot = User([], 0, 0);
    const client = Client([author, odinBot], channel, odinBot);
    const data = {
      author,
      content: `${odinBot.id} ++`,
      channel,
      client,
      guild: Guild([author]),
    };

    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a user awarding points in a channel listed in the config file', async () => {
    jest.mock(
      '../config',
      () => ({
        noPointsChannels: ['513125912070455296', '123456789'],
      }),
      { virtual: true },
    );
    const mentionedUser = User([], 2, 20);
    const botSpamChannel = Channel('513125912070455296');
    const bannedChannel = Channel('123456789');
    const client = Client([author, mentionedUser], botSpamChannel);

    const botSpamChannelData = {
      author,
      content: `${mentionedUser.id} ++`,
      channel: botSpamChannel,
      client,
      guild: Guild([author, mentionedUser]),
    };

    const bannedChannelData = {
      author,
      content: `${mentionedUser.id} ++`,
      channel: bannedChannel,
      client,
      guild: Guild([author, mentionedUser]),
    };

    await commands.awardPoints.cb(botSpamChannelData);
    expect(botSpamChannelData.channel.send).toHaveBeenCalled();
    expect(
      botSpamChannelData.channel.send.mock.calls[0][0],
    ).toMatchSnapshot();

    await commands.awardPoints.cb(bannedChannelData);
    expect(bannedChannelData.channel.send).toHaveBeenCalled();
    expect(bannedChannelData.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });
});

describe('?++ callback', () => {
  const author = User([], 1, 10);
  const channel = Channel();

  it('returns correct output for a user who does not have an admin role', async () => {
    const mentionedUser = User([], 2, 20);
    const memberMap = new Map();
    memberMap.set('role-1', { name: '@everyone' });
    const member = Member(memberMap);
    // users must be passed in as an array
    const client = Client([author, mentionedUser], channel);
    const data = {
      author,
      content: `${mentionedUser.id} ?++`,
      channel,
      client,
      guild: Guild([author, mentionedUser]),
      member,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: (mentionedUser.points += 2),
      },
    });

    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a single user w/o club-40', async () => {
    const mentionedUser = User([], 2, 20);
    const memberMap = new Map();
    memberMap.set('role-1', { name: 'core' });
    const member = Member(memberMap);
    // users must be passed in as an array
    const client = Client([author, mentionedUser], channel);
    const data = {
      author,
      content: `${mentionedUser.id} ?++`,
      channel,
      client,
      guild: Guild([author, mentionedUser]),
      member,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: (mentionedUser.points += 2),
      },
    });

    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a single user entering club-40', async () => {
    const mentionedUser = User([], 2, 39);
    const memberMap = new Map();
    memberMap.set('role-1', { name: 'core' });
    const member = Member(memberMap);
    const client = Client([author, mentionedUser], channel);
    const data = {
      author,
      content: `${mentionedUser.id} ?++`,
      channel,
      client,
      guild: Guild([author, mentionedUser]),
      member,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: (mentionedUser.points += 2),
      },
    });

    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
  });

  it('returns correct output for a single user re-entering club-40', async () => {
    const mentionedUser = User([], 2, 40);
    const memberMap = new Map();
    memberMap.set('role-1', { name: 'core' });
    const member = Member(memberMap);
    const client = Client([author, mentionedUser], channel);
    const data = {
      author,
      content: `${mentionedUser.id} ?++`,
      channel,
      client,
      guild: Guild([author, mentionedUser]),
      member,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: (mentionedUser.points += 2),
      },
    });

    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
  });

  it('returns correct output for up to five mentioned users', async () => {
    const mentionedUser1 = User([], 2, 33);
    const mentionedUser2 = User([], 3, 21);
    const mentionedUser3 = User([], 4, 2);
    const mentionedUser4 = User([], 5, 0);
    const memberMap = new Map();
    memberMap.set('role-1', { name: 'core' });
    const member = Member(memberMap);
    const client = Client(
      [
        author,
        mentionedUser1,
        mentionedUser2,
        mentionedUser3,
        mentionedUser4,
      ],
      channel,
    );

    const data = {
      author,
      content: `${mentionedUser1.id} ?++ ${mentionedUser2.id} ?++ ${mentionedUser3.id} ?++ ${mentionedUser4.id} ?++`,
      channel,
      client,
      guild: Guild([
        author,
        mentionedUser1,
        mentionedUser2,
        mentionedUser3,
        mentionedUser4,
      ]),
      member,
    };

    axios.post
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser1,
          points: (mentionedUser1.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser2,
          points: (mentionedUser2.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser3,
          points: (mentionedUser3.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser4,
          points: (mentionedUser4.points += 2),
        },
      });

    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalledTimes(4);
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
  });

  it('returns correct output for more than five mentioned users', async () => {
    const mentionedUser1 = User([], 2, 10);
    const mentionedUser2 = User([], 3, 3);
    const mentionedUser3 = User([], 4, 1);
    const mentionedUser4 = User([], 5, 0);
    const mentionedUser5 = User([], 6, 21);
    const memberMap = new Map();
    memberMap.set('role-1', { name: 'core' });
    const member = Member(memberMap);
    const client = Client(
      [
        author,
        mentionedUser1,
        mentionedUser2,
        mentionedUser3,
        mentionedUser4,
        mentionedUser5,
      ],
      channel,
    );

    const data = {
      author,
      content: `${mentionedUser1.id} ?++ ${mentionedUser2.id} ?++ ${mentionedUser3.id} ?++ ${mentionedUser4.id} ?++ ${mentionedUser5.id} ?++`,
      channel,
      client,
      guild: Guild([
        author,
        mentionedUser1,
        mentionedUser2,
        mentionedUser3,
        mentionedUser4,
        mentionedUser5,
      ]),
      member,
    };

    axios.post
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser1,
          points: (mentionedUser1.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser2,
          points: (mentionedUser2.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser3,
          points: (mentionedUser3.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser4,
          points: (mentionedUser4.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser5,
          points: (mentionedUser5.points += 2),
        },
      });

    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalledTimes(6);
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[4][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[5][0]).toMatchSnapshot();
  });

  it('returns correct output for a user mentioning themselves', async () => {
    const client = Client([author], channel);
    const memberMap = new Map();
    memberMap.set('role-1', { name: 'core' });
    const member = Member(memberMap);
    const data = {
      author,
      content: `${author.id} ?++`,
      channel,
      client,
      guild: Guild([author]),
      member,
    };

    axios.post.mockResolvedValue({
      data: {
        ...author,
        points: (author.points += 2),
      },
    });

    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
  });

  it('returns correct output for a user mentioning Odin Bot', async () => {
    const odinBot = User([], 0, 0);
    const memberMap = new Map();
    memberMap.set('role-1', { name: 'core' });
    const member = Member(memberMap);
    const client = Client([author, odinBot], channel, odinBot);
    const data = {
      author,
      content: `${odinBot.id} ?++`,
      channel,
      client,
      guild: Guild([author]),
      member,
    };

    await commands.awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a user awarding points in a channel listed in the config file', async () => {
    jest.mock(
      '../config',
      () => ({
        noPointsChannels: ['513125912070455296', '123456789'],
      }),
      { virtual: true },
    );
    const mentionedUser = User([], 2, 20);
    const memberMap = new Map();
    memberMap.set('role-1', { name: 'core' });
    const member = Member(memberMap);
    const botSpamChannel = Channel('513125912070455296');
    const bannedChannel = Channel('123456789');
    const client = Client([author, mentionedUser], botSpamChannel);

    const botSpamChannelData = {
      author,
      content: `${mentionedUser.id} ?++`,
      channel: botSpamChannel,
      client,
      guild: Guild([author, mentionedUser]),
      member,
    };

    const bannedChannelData = {
      author,
      content: `${mentionedUser.id} ?++`,
      channel: bannedChannel,
      client,
      guild: Guild([author, mentionedUser]),
      member,
    };

    await commands.awardPoints.cb(botSpamChannelData);
    expect(botSpamChannelData.channel.send).toHaveBeenCalled();
    expect(
      botSpamChannelData.channel.send.mock.calls[0][0],
    ).toMatchSnapshot();

    await commands.awardPoints.cb(bannedChannelData);
    expect(bannedChannelData.channel.send).toHaveBeenCalled();
    expect(bannedChannelData.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });
});

describe('@user --', () => {
  describe('regex', () => {
    it.each([
      ['<@!123456789> --'],
      ['thanks <@!123456789> --'],
      ['<@!123456789>--'],
    ])('correct strings trigger the callback', (string) => {
      expect(commands.deductPoints.regex.test(string)).toBeTruthy();
    });
    it.each([
      ['--'],
      [''],
      [' '],
      [' /'],
      ['odin-bot--'],
      ['/--'],
      ['```function("<@!123456789> --", () => {}```'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.deductPoints.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! <@!123456789> --'],
      ["Don't worry about it <@!123456789> --"],
      ['Hey <@!123456789> --'],
      ['/ <@!123456789>-- ^ /me /leaderboard /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.deductPoints.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/--'],
      ["it's about/<@!123456789>--"],
      ['<@!123456789>--isanillusion'],
      ['<@!123456789>--/'],
      ['<@!123456789>--*'],
      ['<@!123456789>--...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.deductPoints.regex.test(string)).toBeFalsy();
      },
    );
  });

  describe('callback', () => {
    it('returns correct output', async () => {
      expect(commands.deductPoints.cb()).toMatchSnapshot();
    });
  });
});

describe('!points', () => {
  describe('regex', () => {
    it.each([
      ['!points <@!123456789>'],
      ['let me check out my !points <@!123456789>'],
      ['!points <@!123456789> <@!123456789>-v2'],
      ['!points'],
    ])('correct strings trigger the callback', (string) => {
      expect(commands.points.regex.test(string)).toBeTruthy();
    });
  });
});
