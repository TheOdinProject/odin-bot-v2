const axios = require('axios');
const {
  Client,
  Guild,
  TextChannel,
  User,
  ODIN_BOT,
} = require('../../utils/mocks/discord');
const awardPoints = require('./award-points');
const deductPoints = require('./deduct-points');

axios.post = jest.fn();
jest.mock('./club-40-gifs.json', () => [
  {
    gif: 'https://i.imgur.com/ofDEfYs.gif',
    author: 'Sully',
  },
]);
jest.mock('../../config', () => {
  const actual = jest.requireActual('../../config');
  actual.channels.noPointsChannelIds = ['513125912070455296', '123456789'];
  return actual;
});

beforeEach(jest.clearAllMocks);

describe('award points', () => {
  it('has the name "award points"', () => {
    expect(awardPoints.name).toBe('award points');
  });

  describe('regex ++', () => {
    it.each([
      ['<@!123456789>++'],
      ['<@!123456789> ++'],
      ['<@!123456789> +++'],
      ['<@!123456789> ++++++++++++'],
      ['thanks<@!123456789> ++'],
      ['thanks <@!123456789> ++'],
      ['thanks <@!123456789>      ++'],
      ['thanks <@!123456789>                 ++'],
    ])("%s' - triggers the callback", (string) => {
      expect(string.match(awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['++'],
      [''],
      [' '],
      [' /'],
      ['odin-bot++'],
      ['/++'],
      ['`<@!123456789> ++`'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(string.match(awardPoints.regex)).toBeFalsy();
    });

    it.each([
      ['Check this out! <@!123456789> ++'],
      ["Don't worry about it <@!123456789> ++"],
      ['Hey <@!123456789> ++'],
      ['/ <@!123456789> ++ ^ /me /leaderboard /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(string.match(awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['<@!123456789> ++!'],
      ['<@!123456789> ++/'],
      ['<@!123456789> ++,'],
      ['<@!123456789> ++...'],
    ])(
      "'%s' - command can be immediately followed by a non-word character",
      (string) => {
        expect(string.match(awardPoints.regex)).toBeTruthy();
      },
    );

    it.each([
      ['<@!123456789> ++i'], // e.g. prevents points if pinging to ask about pre-increment syntax
      ['<@!123456789> ++yes'],
      ['<@!123456789> ++_'],
      ['<@!123456789> ++8'],
    ])(
      "'%s' - command cannot be immediately followed by a word character",
      (string) => {
        expect(string.match(awardPoints.regex)).toBeFalsy();
      },
    );

    it('does not match if the user mention is escaped', () => {
      expect('\\<@!123456789> ++'.match(awardPoints.regex)).toBeFalsy();
    });
  });

  describe('regex ?++', () => {
    it.each([
      ['<@!123456789>?++'],
      ['<@!123456789> ?++'],
      ['<@!123456789> ?+++'],
      ['<@!123456789> ?++++++++++++'],
      ['<@!123456789>     ?++++++++++++'],
      ['<@!123456789>          ?++++++++++++'],
      ['thanks <@!123456789> ?++'],
      ['thanks<@!123456789> ?++'],
    ])("%s' - triggers the callback", (string) => {
      expect(string.match(awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['?++'],
      [''],
      [' '],
      [' /'],
      ['odin-bot?++'],
      ['/?++'],
      ['`<@!123456789> ?++`'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(string.match(awardPoints.regex)).toBeFalsy();
    });

    it.each([
      ['Check this out! <@!123456789> ?++'],
      ["Don't worry about it <@!123456789> ?++"],
      ['Hey <@!123456789> ?++'],
      ['/ <@!123456789> ?++ ^ /me /leaderboard /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(string.match(awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['<@!123456789> ?++!'],
      ['<@!123456789> ?++/'],
      ['<@!123456789> ?++,'],
      ['<@!123456789> ?++...'],
    ])(
      "'%s' - command can be immediately followed by a non-word character",
      (string) => {
        expect(string.match(awardPoints.regex)).toBeTruthy();
      },
    );

    it.each([
      ['<@!123456789> ?++i'],
      ['<@!123456789> ?++yes'],
      ['<@!123456789> ?++_'],
      ['<@!123456789> ?++8'],
    ])(
      "'%s' - command cannot be immediately followed by a word character",
      (string) => {
        expect(string.match(awardPoints.regex)).toBeFalsy();
      },
    );

    it('does not match if the user mention is escaped', () => {
      expect('\\<@!123456789> ?++'.match(awardPoints.regex)).toBeFalsy();
    });
  });

  describe('regex ⭐', () => {
    it.each([
      ['<@!123456789>⭐'],
      ['<@!123456789> ⭐'],
      ['<@!123456789>     ⭐'],
      ['thanks <@!123456789> ⭐'],
      ['thanks<@!123456789> ⭐'],
    ])("'%s' - correct strings trigger the callback", (string) => {
      expect(string.match(awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['⭐'],
      [''],
      [' '],
      [' /'],
      ['odin-bot⭐'],
      ['/⭐'],
      ['`<@!123456789> ⭐`'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(string.match(awardPoints.regex)).toBeFalsy();
    });

    it.each([
      ['Check this out! <@!123456789> ⭐'],
      ["Don't worry about it <@!123456789> ⭐"],
      ['Hey <@!123456789> ⭐'],
      ['/ <@!123456789> ⭐ ^ /me /leaderboard /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(string.match(awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['<@!123456789> ⭐!'],
      ['<@!123456789> ⭐/'],
      ['<@!123456789> ⭐,'],
      ['<@!123456789> ⭐...'],
    ])(
      "'%s' - command can be immediately followed by a non-word character",
      (string) => {
        expect(string.match(awardPoints.regex)).toBeTruthy();
      },
    );

    it.each([['<@!123456789> ⭐thanks'], ['<@!123456789> ⭐yes']])(
      "'%s' - :star: command can be immediately followed by a word character",
      (string) => {
        expect(string.match(awardPoints.regex)).toBeTruthy();
      },
    );

    it('does not match if the user mention is escaped', () => {
      expect('\\<@!123456789> ⭐'.match(awardPoints.regex)).toBeFalsy();
    });
  });
});

describe('callback', () => {
  const author = new User({ id: 1, points: 10 });
  const channel = new TextChannel();
  const club40Channel = new TextChannel('707225752608964628');

  it('returns correct output for a single user w/o club-40', async () => {
    const mentionedUser = new User({ id: 2, points: 20 });
    // users must be passed in as an array
    const client = new Client({
      users: [author, mentionedUser],
      channels: [channel],
    });
    const guild = new Guild({
      members: [author.toGuildMember(), mentionedUser.toGuildMember()],
    });
    const data = {
      author,
      content: `${mentionedUser} ++`,
      channel,
      client,
      guild,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: (mentionedUser.points += 1),
      },
    });

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a single user entering club-40', async () => {
    const mentionedUser = new User({ id: 2, points: 39 });
    const client = new Client({
      users: [author, mentionedUser],
      channels: [channel, club40Channel],
    });
    const guild = new Guild({
      members: [author.toGuildMember(), mentionedUser.toGuildMember()],
    });
    const data = {
      author,
      content: `${mentionedUser} ++`,
      channel,
      client,
      guild,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: (mentionedUser.points += 1),
      },
    });

    await awardPoints.cb(data);
    expect(club40Channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(club40Channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(club40Channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a single user re-entering club-40', async () => {
    const mentionedUser = new User({ id: 2, points: 40 });
    const client = new Client({
      users: [author, mentionedUser],
      channels: [channel, club40Channel],
    });
    const guild = new Guild({
      members: [author.toGuildMember(), mentionedUser.toGuildMember()],
    });
    const data = {
      author,
      content: `${mentionedUser} ++`,
      channel,
      client,
      guild,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: (mentionedUser.points += 1),
      },
    });

    await awardPoints.cb(data);
    expect(club40Channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(club40Channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(club40Channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for up to five mentioned users', async () => {
    const mentionedUser1 = new User({ id: 2, points: 33 });
    const mentionedUser2 = new User({ id: 3, points: 21 });
    const mentionedUser3 = new User({ id: 4, points: 2 });
    const mentionedUser4 = new User({ id: 5, points: 0 });
    const client = new Client({
      users: [
        author,
        mentionedUser1,
        mentionedUser2,
        mentionedUser3,
        mentionedUser4,
      ],
      channels: [channel],
    });
    const guild = new Guild({
      members: [
        author.toGuildMember(),
        mentionedUser1.toGuildMember(),
        mentionedUser2.toGuildMember(),
        mentionedUser3.toGuildMember(),
        mentionedUser4.toGuildMember(),
      ],
    });

    const data = {
      author,
      content: `${mentionedUser1} ++ ${mentionedUser2} ++ ${mentionedUser3} ++ ${mentionedUser4} ++`,
      channel,
      client,
      guild,
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

    await awardPoints.cb(data);

    expect(data.channel.send).toHaveBeenCalledTimes(4);
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
  });

  describe('where one user is mentioned more than once', () => {
    it('returns correct output for only 1 user mentioned twice', async () => {
      const mentionedUser = new User({ id: 2, points: 5 });
      const client = new Client({
        users: [author, mentionedUser],
        channels: [channel],
      });
      const guild = new Guild({
        members: [author.toGuildMember(), mentionedUser.toGuildMember()],
      });
      const data = {
        author,
        content: `${mentionedUser} ++ ${mentionedUser} ++`,
        channel,
        client,
        guild,
      };

      axios.post.mockResolvedValueOnce({
        data: {
          ...mentionedUser,
          points: (mentionedUser.points += 1),
        },
      });

      await awardPoints.cb(data);

      expect(data.channel.send).toHaveBeenCalledTimes(2);
      expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    });

    it('returns correct output for only 1 user mentioned more than 5 times', async () => {
      const mentionedUser = new User({ id: 2, points: 5 });
      const client = new Client({
        users: [author, mentionedUser],
        channels: [channel],
      });
      const guild = new Guild({
        members: [author.toGuildMember(), mentionedUser.toGuildMember()],
      });
      const data = {
        author,
        content: `${mentionedUser} ++ ${mentionedUser} ++ ${mentionedUser} ++ ${mentionedUser} ++ ${mentionedUser} ++ ${mentionedUser} ++`,
        channel,
        client,
        guild,
      };

      axios.post.mockResolvedValueOnce({
        data: {
          ...mentionedUser,
          points: (mentionedUser.points += 1),
        },
      });

      await awardPoints.cb(data);

      expect(data.channel.send).toHaveBeenCalledTimes(6);
      expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[4][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[5][0]).toMatchSnapshot();
    });

    it('returns correct output for 1 user mentioned more than once with another user', async () => {
      const mentionedUser1 = new User({ id: 2, points: 21 });
      const mentionedUser2 = new User({ id: 3, points: 23 });
      const client = new Client({
        users: [author, mentionedUser1, mentionedUser2],
        channels: [channel],
      });
      const guild = new Guild({
        members: [
          author.toGuildMember(),
          mentionedUser1.toGuildMember(),
          mentionedUser2.toGuildMember(),
        ],
      });

      const data = {
        author,
        content: `${mentionedUser1} ++ ${mentionedUser1} ++ ${mentionedUser2} ++`,
        channel,
        client,
        guild,
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

      await awardPoints.cb(data);

      expect(data.channel.send).toHaveBeenCalledTimes(3);
      expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    });
  });

  it('returns correct output for more than five mentioned users', async () => {
    const mentionedUser1 = new User({ id: 2, points: 10 });
    const mentionedUser2 = new User({ id: 3, points: 3 });
    const mentionedUser3 = new User({ id: 4, points: 1 });
    const mentionedUser4 = new User({ id: 5, points: 0 });
    const mentionedUser5 = new User({ id: 6, points: 21 });
    const mentionedUser6 = new User({ id: 7, points: 29 });
    const client = new Client({
      users: [
        author,
        mentionedUser1,
        mentionedUser2,
        mentionedUser3,
        mentionedUser4,
        mentionedUser5,
        mentionedUser6,
      ],
      channels: [channel],
    });
    const guild = new Guild({
      members: [
        author.toGuildMember(),
        mentionedUser1.toGuildMember(),
        mentionedUser2.toGuildMember(),
        mentionedUser3.toGuildMember(),
        mentionedUser4.toGuildMember(),
        mentionedUser5.toGuildMember(),
        mentionedUser6.toGuildMember(),
      ],
    });

    const data = {
      author,
      content: `${mentionedUser1} ++ ${mentionedUser2} ++ ${mentionedUser3} ++ ${mentionedUser4} ++ ${mentionedUser5} ++ ${mentionedUser6} ++`,
      channel,
      client,
      guild,
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
    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalledTimes(6);
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[4][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[5][0]).toMatchSnapshot();
  });

  it('returns correct output for a user mentioning themselves', async () => {
    const client = new Client({ users: [author], channels: [channel] });
    const guild = new Guild({ members: [author.toGuildMember()] });
    const data = {
      author,
      content: `${author} ++`,
      channel,
      client,
      guild,
    };

    axios.post.mockResolvedValue({
      data: {
        ...author,
        points: (author.points += 1),
      },
    });

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
  });

  it('returns correct output for a user mentioning Odin Bot', async () => {
    const client = new Client({
      users: [author],
      channels: [channel],
    });
    const guild = new Guild({ members: [author] });

    const data = {
      author,
      content: `${ODIN_BOT} ++`,
      channel,
      client,
      guild,
    };

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a user awarding points in a channel listed in the config file', async () => {
    const mentionedUser = new User({ id: 2, points: 20 });
    const botSpamChannel = new TextChannel('513125912070455296');
    const bannedChannel = new TextChannel('123456789');
    const client = new Client({
      users: [author, mentionedUser],
      channels: [botSpamChannel],
    });
    const guild = new Guild({
      members: [author.toGuildMember(), mentionedUser.toGuildMember()],
    });

    const botSpamChannelData = {
      author,
      content: `${mentionedUser} ++`,
      channel: botSpamChannel,
      client,
      guild,
    };

    const bannedChannelData = {
      author,
      content: `${mentionedUser} ++`,
      channel: bannedChannel,
      client,
      guild,
    };

    await awardPoints.cb(botSpamChannelData);
    expect(botSpamChannelData.channel.send).toHaveBeenCalled();
    expect(botSpamChannelData.channel.send.mock.calls[0][0]).toMatchSnapshot();

    await awardPoints.cb(bannedChannelData);
    expect(bannedChannelData.channel.send).toHaveBeenCalled();
    expect(bannedChannelData.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });
});

describe('?++ callback', () => {
  const nonStaffAuthor = new User({ id: 1, points: 10, roles: ['@everyone'] });
  const author = new User({ id: 1, points: 10, roles: ['core'] });
  const channel = new TextChannel();
  const club40Channel = new TextChannel('707225752608964628');

  it('returns correct output for a user who does not have an admin role', async () => {
    const mentionedUser = new User({ id: 2, points: 20 });
    const client = new Client({
      users: [nonStaffAuthor, mentionedUser],
      channels: [channel],
    });
    const guild = new Guild({
      members: [nonStaffAuthor.toGuildMember(), mentionedUser.toGuildMember()],
    });
    const data = {
      author,
      content: `${mentionedUser} ?++`,
      channel,
      client,
      guild,
      member: nonStaffAuthor.toGuildMember(),
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: mentionedUser.points,
      },
    });

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a single user w/o club-40', async () => {
    const mentionedUser = new User({ id: 2, points: 20 });
    const client = new Client({
      users: [author, mentionedUser],
      channels: [channel],
    });
    const guild = new Guild({
      members: [author.toGuildMember(), mentionedUser.toGuildMember()],
    });
    const data = {
      author,
      content: `${mentionedUser} ?++`,
      channel,
      client,
      guild,
      member: author.toGuildMember(),
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: (mentionedUser.points += 2),
      },
    });

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a single user entering club-40', async () => {
    const mentionedUser = new User({ id: 2, points: 39 });
    const client = new Client({
      users: [author, mentionedUser],
      channels: [channel, club40Channel],
    });
    const guild = new Guild({
      members: [author.toGuildMember(), mentionedUser.toGuildMember()],
    });
    const data = {
      author,
      content: `${mentionedUser} ?++`,
      channel,
      client,
      guild,
      member: author.toGuildMember(),
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: (mentionedUser.points += 2),
      },
    });

    await awardPoints.cb(data);
    expect(club40Channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(club40Channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(club40Channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a single user re-entering club-40', async () => {
    const mentionedUser = new User({ id: 2, points: 40 });
    const client = new Client({
      users: [author, mentionedUser],
      channels: [channel, club40Channel],
    });
    const guild = new Guild({
      members: [author.toGuildMember(), mentionedUser.toGuildMember()],
    });
    const data = {
      author,
      content: `${mentionedUser} ?++`,
      channel,
      client,
      guild,
      member: author.toGuildMember(),
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser,
        points: (mentionedUser.points += 2),
      },
    });

    await awardPoints.cb(data);
    expect(club40Channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(club40Channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(club40Channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for up to five mentioned users', async () => {
    const mentionedUser1 = new User({ id: 2, points: 33 });
    const mentionedUser2 = new User({ id: 3, points: 21 });
    const mentionedUser3 = new User({ id: 4, points: 2 });
    const mentionedUser4 = new User({ id: 5, points: 0 });
    const client = new Client({
      users: [
        author,
        mentionedUser1,
        mentionedUser2,
        mentionedUser3,
        mentionedUser4,
      ],
      channels: [channel],
    });
    const guild = new Guild({
      members: [
        author.toGuildMember(),
        mentionedUser1.toGuildMember(),
        mentionedUser2.toGuildMember(),
        mentionedUser3.toGuildMember(),
        mentionedUser4.toGuildMember(),
      ],
    });

    const data = {
      author,
      content: `${mentionedUser1} ?++ ${mentionedUser2} ?++ ${mentionedUser3} ?++ ${mentionedUser4} ?++`,
      channel,
      client,
      guild,
      member: author.toGuildMember(),
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

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalledTimes(4);
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
  });

  it('returns correct output for more than five mentioned users', async () => {
    const mentionedUser1 = new User({ id: 2, points: 10 });
    const mentionedUser2 = new User({ id: 3, points: 3 });
    const mentionedUser3 = new User({ id: 4, points: 1 });
    const mentionedUser4 = new User({ id: 5, points: 0 });
    const mentionedUser5 = new User({ id: 6, points: 21 });
    const mentionedUser6 = new User({ id: 7, points: 29 });
    const client = new Client({
      users: [
        author,
        mentionedUser1,
        mentionedUser2,
        mentionedUser3,
        mentionedUser4,
        mentionedUser5,
        mentionedUser6,
      ],
      channels: [channel],
    });
    const guild = new Guild({
      members: [
        author.toGuildMember(),
        mentionedUser1.toGuildMember(),
        mentionedUser2.toGuildMember(),
        mentionedUser3.toGuildMember(),
        mentionedUser4.toGuildMember(),
        mentionedUser5.toGuildMember(),
        mentionedUser6.toGuildMember(),
      ],
    });

    const data = {
      author,
      content: `${mentionedUser1} ?++ ${mentionedUser2} ?++ ${mentionedUser3} ?++ ${mentionedUser4} ?++ ${mentionedUser5} ?++ ${mentionedUser6} ?++`,
      channel,
      client,
      guild,
      member: author.toGuildMember(),
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

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalledTimes(6);
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[2][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[3][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[4][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[5][0]).toMatchSnapshot();
  });

  it('returns correct output for a user mentioning themselves', async () => {
    const client = new Client({ users: [author], channels: [channel] });
    const guild = new Guild({ members: [author.toGuildMember()] });
    const data = {
      author,
      content: `${author} ?++`,
      channel,
      client,
      guild,
      member: author.toGuildMember(),
    };

    axios.post.mockResolvedValue({
      data: {
        ...author,
        points: (author.points += 2),
      },
    });

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
    expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
  });

  it('returns correct output for a user mentioning Odin Bot', async () => {
    const client = new Client({
      users: [author, ODIN_BOT],
      channels: [channel],
    });
    const guild = new Guild({
      members: [author.toGuildMember(), ODIN_BOT],
    });
    const data = {
      author,
      content: `${ODIN_BOT} ?++`,
      channel,
      client,
      guild,
      member: author.toGuildMember(),
    };

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a user awarding points in a channel listed in the config file', async () => {
    const mentionedUser = new User({ id: 2, points: 20 });
    const botSpamChannel = new TextChannel('513125912070455296');
    const bannedChannel = new TextChannel('123456789');
    const client = new Client({
      users: [author, mentionedUser],
      channels: [botSpamChannel, bannedChannel],
    });
    const guild = new Guild({
      members: [author.toGuildMember(), mentionedUser.toGuildMember()],
    });

    const botSpamChannelData = {
      author,
      content: `${mentionedUser} ?++`,
      channel: botSpamChannel,
      client,
      guild,
      member: author.toGuildMember(),
    };

    const bannedChannelData = {
      author,
      content: `${mentionedUser} ?++`,
      channel: bannedChannel,
      client,
      guild,
      member: author.toGuildMember(),
    };

    await awardPoints.cb(botSpamChannelData);
    expect(botSpamChannelData.channel.send).toHaveBeenCalled();
    expect(botSpamChannelData.channel.send.mock.calls[0][0]).toMatchSnapshot();

    await awardPoints.cb(bannedChannelData);
    expect(bannedChannelData.channel.send).toHaveBeenCalled();
    expect(bannedChannelData.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('sends the correct exclamations for mixed awarding (++ and ?++) in a single message', async () => {
    const mentionedUser1 = new User({ id: 2, points: 0 });
    const mentionedUser2 = new User({ id: 3, points: 0 });
    const client = new Client({
      users: [author, mentionedUser1, mentionedUser2],
      channels: [channel],
    });
    const guild = new Guild({
      members: [
        author.toGuildMember(),
        mentionedUser1.toGuildMember(),
        mentionedUser2.toGuildMember(),
      ],
    });

    const data = {
      author,
      content: `${mentionedUser1} ?++ ${mentionedUser2} ++`,
      channel,
      client,
      guild,
      member: author.toGuildMember(),
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
          points: (mentionedUser2.points += 1),
        },
      });

    await awardPoints.cb(data);

    expect(data.channel.send.mock.calls.flat()).toEqual([
      `Thanks for the great question! ${mentionedUser1} now has ${mentionedUser1.points} points`,
      `Nice! ${mentionedUser2} now has ${mentionedUser2.points} point`,
    ]);
  });
});

describe('@user --', () => {
  it('has the name "deduct points"', () => {
    expect(deductPoints.name).toBe('deduct points');
  });

  describe('regex', () => {
    it.each([
      ['<@!123456789> --'],
      ['thanks <@!123456789> --'],
      ['<@!123456789>--'],
    ])('correct strings trigger the callback', (string) => {
      expect(deductPoints.regex.test(string)).toBeTruthy();
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
      expect(deductPoints.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! <@!123456789> --'],
      ["Don't worry about it <@!123456789> --"],
      ['Hey <@!123456789> --'],
      ['/ <@!123456789>-- ^ /me /leaderboard /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(deductPoints.regex.test(string)).toBeTruthy();
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
        expect(deductPoints.regex.test(string)).toBeFalsy();
      },
    );
  });

  describe('callback', () => {
    it('returns correct output', async () => {
      expect(deductPoints.cb()).toMatchSnapshot();
    });
  });
});
