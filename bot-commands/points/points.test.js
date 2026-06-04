const axios = require('axios');
const {
  Client,
  Guild,
  TextChannel,
  GuildMember,
  Role,
} = require('../../test/mocks/discord');
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
  const author = { member: new GuildMember({ id: 1 }), points: 10 };
  const channel = new TextChannel();
  const club40Channel = new TextChannel('707225752608964628');

  it('returns correct output for a single user w/o club-40', async () => {
    const mentionedUser = { member: new GuildMember({ id: 2 }), points: 20 };
    // users must be passed in as an array
    const client = new Client({
      users: [author.member.user, mentionedUser.member.user],
      channels: [channel],
    });
    const guild = new Guild({
      members: [author.member, mentionedUser.member],
    });
    const data = {
      author: author.member.user,
      content: `${mentionedUser.member.user} ++`,
      channel,
      client,
      guild,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser.member.user,
        points: (mentionedUser.points += 1),
      },
    });

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a single user entering club-40', async () => {
    const mentionedUser = { member: new GuildMember({ id: 2 }), points: 39 };
    const client = new Client({
      users: [author.member.user, mentionedUser.member.user],
      channels: [channel, club40Channel],
    });
    const guild = new Guild({
      members: [author.member, mentionedUser.member],
    });
    const data = {
      author: author.member.user,
      content: `${mentionedUser.member.user} ++`,
      channel,
      client,
      guild,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser.member.user,
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
    const mentionedUser = { member: new GuildMember({ id: 2 }), points: 40 };
    const client = new Client({
      users: [author.member.user, mentionedUser.member.user],
      channels: [channel, club40Channel],
    });
    const guild = new Guild({
      members: [author.member, mentionedUser.member],
    });
    const data = {
      author: author.member.user,
      content: `${mentionedUser.member.user} ++`,
      channel,
      client,
      guild,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser.member.user,
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
    const mentionedUser1 = {
      member: new GuildMember({ id: 2 }),
      points: 33,
    };
    const mentionedUser2 = { member: new GuildMember({ id: 3 }), points: 21 };
    const mentionedUser3 = { member: new GuildMember({ id: 4 }), points: 2 };
    const mentionedUser4 = { member: new GuildMember({ id: 5 }), points: 0 };
    const client = new Client({
      users: [
        author.member.user,
        mentionedUser1.member.user,
        mentionedUser2.member.user,
        mentionedUser3.member.user,
        mentionedUser4.member.user,
      ],
      channels: [channel],
    });
    const guild = new Guild({
      members: [
        author.member,
        mentionedUser1.member,
        mentionedUser2.member,
        mentionedUser3.member,
        mentionedUser4.member,
      ],
    });

    const data = {
      author: author.member.user,
      content: `${mentionedUser1.member.user} ++ ${mentionedUser2.member.user} ++ ${mentionedUser3.member.user} ++ ${mentionedUser4.member.user} ++`,
      channel,
      client,
      guild,
    };

    axios.post
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser1.member.user,
          points: (mentionedUser1.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser2.member.user,
          points: (mentionedUser2.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser3.member.user,
          points: (mentionedUser3.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser4.member.user,
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
      const mentionedUser = { member: new GuildMember({ id: 2 }), points: 5 };
      const client = new Client({
        users: [author.member.user, mentionedUser.member.user],
        channels: [channel],
      });
      const guild = new Guild({
        members: [author.member, mentionedUser.member],
      });
      const data = {
        author: author.member.user,
        content: `${mentionedUser.member.user} ++ ${mentionedUser.member.user} ++`,
        channel,
        client,
        guild,
      };

      axios.post.mockResolvedValueOnce({
        data: {
          ...mentionedUser.member.user,
          points: (mentionedUser.points += 1),
        },
      });

      await awardPoints.cb(data);

      expect(data.channel.send).toHaveBeenCalledTimes(2);
      expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
      expect(data.channel.send.mock.calls[1][0]).toMatchSnapshot();
    });

    it('returns correct output for only 1 user mentioned more than 5 times', async () => {
      const mentionedUser = { member: new GuildMember({ id: 2 }), points: 5 };
      const client = new Client({
        users: [author.member.user, mentionedUser.member.user],
        channels: [channel],
      });
      const guild = new Guild({
        members: [author.member, mentionedUser.member],
      });
      const data = {
        author: author.member.user,
        content: `${mentionedUser.member.user} ++ ${mentionedUser.member.user} ++ ${mentionedUser.member.user} ++ ${mentionedUser.member.user} ++ ${mentionedUser.member.user} ++ ${mentionedUser.member.user} ++`,
        channel,
        client,
        guild,
      };

      axios.post.mockResolvedValueOnce({
        data: {
          ...mentionedUser.member.user,
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
      const mentionedUser1 = { member: new GuildMember({ id: 2 }), points: 21 };
      const mentionedUser2 = { member: new GuildMember({ id: 3 }), points: 23 };
      const client = new Client({
        users: [
          author.member.user,
          mentionedUser1.member.user,
          mentionedUser2.member.user,
        ],
        channels: [channel],
      });
      const guild = new Guild({
        members: [author.member, mentionedUser1.member, mentionedUser2.member],
      });

      const data = {
        author: author.member.user,
        content: `${mentionedUser1.member.user} ++ ${mentionedUser1.member.user} ++ ${mentionedUser2.member.user} ++`,
        channel,
        client,
        guild,
      };

      axios.post
        .mockResolvedValueOnce({
          data: {
            ...mentionedUser1.member.user,
            points: (mentionedUser1.points += 1),
          },
        })
        .mockResolvedValueOnce({
          data: {
            ...mentionedUser2.member.user,
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
    const mentionedUser1 = { member: new GuildMember({ id: 2 }), points: 10 };
    const mentionedUser2 = { member: new GuildMember({ id: 3 }), points: 3 };
    const mentionedUser3 = { member: new GuildMember({ id: 4 }), points: 1 };
    const mentionedUser4 = { member: new GuildMember({ id: 5 }), points: 0 };
    const mentionedUser5 = { member: new GuildMember({ id: 6 }), points: 21 };
    const mentionedUser6 = { member: new GuildMember({ id: 7 }), points: 29 };
    const client = new Client({
      users: [
        author.member.user,
        mentionedUser1.member.user,
        mentionedUser2.member.user,
        mentionedUser3.member.user,
        mentionedUser4.member.user,
        mentionedUser5.member.user,
        mentionedUser6.member.user,
      ],
      channels: [channel],
    });
    const guild = new Guild({
      members: [
        author.member,
        mentionedUser1.member,
        mentionedUser2.member,
        mentionedUser3.member,
        mentionedUser4.member,
        mentionedUser5.member,
        mentionedUser6.member,
      ],
    });

    const data = {
      author: author.member.user,
      content: `${mentionedUser1.member.user} ++ ${mentionedUser2.member.user} ++ ${mentionedUser3.member.user} ++ ${mentionedUser4.member.user} ++ ${mentionedUser5.member.user} ++ ${mentionedUser6.member.user} ++`,
      channel,
      client,
      guild,
    };

    axios.post
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser1.member.user,
          points: (mentionedUser1.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser2.member.user,
          points: (mentionedUser2.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser3.member.user,
          points: (mentionedUser3.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser4.member.user,
          points: (mentionedUser4.points += 1),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser5.member.user,
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
    const client = new Client({
      users: [author.member.user],
      channels: [channel],
    });
    const guild = new Guild({ members: [author.member] });
    const data = {
      author: author.member.user,
      content: `${author.member.user} ++`,
      channel,
      client,
      guild,
    };

    axios.post.mockResolvedValue({
      data: {
        ...author.member.user,
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
      users: [author.member.user],
      channels: [channel],
    });
    const guild = new Guild({ members: [author.member] });

    const data = {
      author: author.member.user,
      content: `${GuildMember.odinBot.user} ++`,
      channel,
      client,
      guild,
    };

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a user awarding points in a no-points channel', async () => {
    const mentionedUser = { member: new GuildMember({ id: 2 }), points: 20 };
    const botSpamChannel = new TextChannel('513125912070455296');
    const bannedChannel = new TextChannel('123456789');
    const client = new Client({
      users: [author.member.user, mentionedUser.member.user],
      channels: [botSpamChannel],
    });
    const guild = new Guild({
      members: [author.member, mentionedUser.member],
    });

    const botSpamChannelData = {
      author: author.member.user,
      content: `${mentionedUser.member.user} ++`,
      channel: botSpamChannel,
      client,
      guild,
    };

    const bannedChannelData = {
      author: author.member.user,
      content: `${mentionedUser.member.user} ++`,
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
  const nonStaffAuthor = {
    member: new GuildMember({
      id: 1,
      roles: [new Role(0, '@everyone')],
    }),
    points: 10,
  };
  const author = {
    member: new GuildMember({ id: 1, roles: [new Role(1, 'core')] }),
    points: 10,
  };

  const channel = new TextChannel();
  const club40Channel = new TextChannel('707225752608964628');

  it('does not award points when used by non-staff', async () => {
    const mentionedUser = { member: new GuildMember({ id: 2 }), points: 20 };
    const client = new Client({
      users: [nonStaffAuthor.member.user, mentionedUser.member.user],
      channels: [channel],
    });
    const guild = new Guild({
      members: [nonStaffAuthor.member, mentionedUser.member],
    });
    const data = {
      author: author.member.user,
      content: `${mentionedUser.member.user} ?++`,
      channel,
      client,
      guild,
      member: nonStaffAuthor.member,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser.member.user,
        points: mentionedUser.points,
      },
    });

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('awards points when used by staff', async () => {
    const mentionedUser = { member: new GuildMember({ id: 2 }), points: 20 };
    const client = new Client({
      users: [author.member.user, mentionedUser.member.user],
      channels: [channel],
    });
    const guild = new Guild({
      members: [author.member, mentionedUser.member],
    });
    const data = {
      author: author.member.user,
      content: `${mentionedUser.member.user} ?++`,
      channel,
      client,
      guild,
      member: author.member,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser.member.user,
        points: (mentionedUser.points += 2),
      },
    });

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a single user entering club-40', async () => {
    const mentionedUser = { member: new GuildMember({ id: 2 }), points: 39 };
    const client = new Client({
      users: [author.member.user, mentionedUser.member.user],
      channels: [channel, club40Channel],
    });
    const guild = new Guild({
      members: [author.member, mentionedUser.member],
    });
    const data = {
      author: author.member.user,
      content: `${mentionedUser.member.user} ?++`,
      channel,
      client,
      guild,
      member: author.member,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser.member.user,
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
    const mentionedUser = { member: new GuildMember({ id: 2 }), points: 40 };
    const client = new Client({
      users: [author.member.user, mentionedUser.member.user],
      channels: [channel, club40Channel],
    });
    const guild = new Guild({
      members: [author.member, mentionedUser.member],
    });
    const data = {
      author: author.member.user,
      content: `${mentionedUser.member.user} ?++`,
      channel,
      client,
      guild,
      member: author.member,
    };

    axios.post.mockResolvedValue({
      data: {
        ...mentionedUser.member.user,
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
    const mentionedUser1 = { member: new GuildMember({ id: 2 }), points: 33 };
    const mentionedUser2 = { member: new GuildMember({ id: 3 }), points: 21 };
    const mentionedUser3 = { member: new GuildMember({ id: 4 }), points: 2 };
    const mentionedUser4 = { member: new GuildMember({ id: 5 }), points: 0 };
    const client = new Client({
      users: [
        author.member.user,
        mentionedUser1.member.user,
        mentionedUser2.member.user,
        mentionedUser3.member.user,
        mentionedUser4.member.user,
      ],
      channels: [channel],
    });
    const guild = new Guild({
      members: [
        author.member,
        mentionedUser1.member,
        mentionedUser2.member,
        mentionedUser3.member,
        mentionedUser4.member,
      ],
    });

    const data = {
      author: author.member.user,
      content: `${mentionedUser1.member.user} ?++ ${mentionedUser2.member.user} ?++ ${mentionedUser3.member.user} ?++ ${mentionedUser4.member.user} ?++`,
      channel,
      client,
      guild,
      member: author.member,
    };

    axios.post
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser1.member.user,
          points: (mentionedUser1.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser2.member.user,
          points: (mentionedUser2.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser3.member.user,
          points: (mentionedUser3.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser4.member.user,
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
    const mentionedUser1 = { member: new GuildMember({ id: 2 }), points: 10 };
    const mentionedUser2 = { member: new GuildMember({ id: 3 }), points: 3 };
    const mentionedUser3 = { member: new GuildMember({ id: 4 }), points: 1 };
    const mentionedUser4 = { member: new GuildMember({ id: 5 }), points: 0 };
    const mentionedUser5 = { member: new GuildMember({ id: 6 }), points: 21 };
    const mentionedUser6 = { member: new GuildMember({ id: 7 }), points: 29 };
    const client = new Client({
      users: [
        author.member.user,
        mentionedUser1.member.user,
        mentionedUser2.member.user,
        mentionedUser3.member.user,
        mentionedUser4.member.user,
        mentionedUser5.member.user,
        mentionedUser6.member.user,
      ],
      channels: [channel],
    });
    const guild = new Guild({
      members: [
        author.member,
        mentionedUser1.member,
        mentionedUser2.member,
        mentionedUser3.member,
        mentionedUser4.member,
        mentionedUser5.member,
        mentionedUser6.member,
      ],
    });

    const data = {
      author: author.member.user,
      content: `${mentionedUser1.member.user} ?++ ${mentionedUser2.member.user} ?++ ${mentionedUser3.member.user} ?++ ${mentionedUser4.member.user} ?++ ${mentionedUser5.member.user} ?++ ${mentionedUser6.member.user} ?++`,
      channel,
      client,
      guild,
      member: author.member,
    };

    axios.post
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser1.member.user,
          points: (mentionedUser1.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser2.member.user,
          points: (mentionedUser2.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser3.member.user,
          points: (mentionedUser3.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser4.member.user,
          points: (mentionedUser4.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser5.member.user,
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
    const client = new Client({
      users: [author.member.user],
      channels: [channel],
    });
    const guild = new Guild({ members: [author.member] });
    const data = {
      author: author.member.user,
      content: `${author.member.user} ?++`,
      channel,
      client,
      guild,
      member: author.member,
    };

    axios.post.mockResolvedValue({
      data: {
        ...author.member.user,
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
      users: [author.member.user],
      channels: [channel],
    });

    const guild = new Guild({
      members: [author.member],
    });

    const data = {
      author: author.member.user,
      content: `${GuildMember.odinBot.user} ?++`,
      channel,
      client,
      guild,
      member: author.member,
    };

    await awardPoints.cb(data);
    expect(data.channel.send).toHaveBeenCalled();
    expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('returns correct output for a user awarding points in a no-points channel', async () => {
    const mentionedUser = { member: new GuildMember({ id: 2 }), points: 20 };
    const botSpamChannel = new TextChannel('513125912070455296');
    const bannedChannel = new TextChannel('123456789');
    const client = new Client({
      users: [author.member.user, mentionedUser.member.user],
      channels: [botSpamChannel, bannedChannel],
    });
    const guild = new Guild({
      members: [author.member, mentionedUser.member],
    });

    const botSpamChannelData = {
      author: author.member.user,
      content: `${mentionedUser.member.user} ?++`,
      channel: botSpamChannel,
      client,
      guild,
      member: author.member,
    };

    const bannedChannelData = {
      author: author.member.user,
      content: `${mentionedUser.member.user} ?++`,
      channel: bannedChannel,
      client,
      guild,
      member: author.member,
    };

    await awardPoints.cb(botSpamChannelData);
    expect(botSpamChannelData.channel.send).toHaveBeenCalled();
    expect(botSpamChannelData.channel.send.mock.calls[0][0]).toMatchSnapshot();

    await awardPoints.cb(bannedChannelData);
    expect(bannedChannelData.channel.send).toHaveBeenCalled();
    expect(bannedChannelData.channel.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('sends the correct exclamations for mixed awarding (++ and ?++) in a single message', async () => {
    const mentionedUser1 = { member: new GuildMember({ id: 2 }), points: 0 };
    const mentionedUser2 = { member: new GuildMember({ id: 3 }), points: 0 };
    const client = new Client({
      users: [
        author.member.user,
        mentionedUser1.member.user,
        mentionedUser2.member.user,
      ],
      channels: [channel],
    });
    const guild = new Guild({
      members: [author.member, mentionedUser1.member, mentionedUser2.member],
    });

    const data = {
      author: author.member.user,
      content: `${mentionedUser1.member.user} ?++ ${mentionedUser2.member.user} ++`,
      channel,
      client,
      guild,
      member: author.member,
    };

    axios.post
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser1.member.user,
          points: (mentionedUser1.points += 2),
        },
      })
      .mockResolvedValueOnce({
        data: {
          ...mentionedUser2.member.user,
          points: (mentionedUser2.points += 1),
        },
      });

    await awardPoints.cb(data);

    expect(data.channel.send.mock.calls.flat()).toEqual([
      `Thanks for the great question! ${mentionedUser1.member.user} now has ${mentionedUser1.points} points`,
      `Nice! ${mentionedUser2.member.user} now has ${mentionedUser2.points} point`,
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
