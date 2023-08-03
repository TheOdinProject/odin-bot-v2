const { execute } = require('../slash/leaderboard');
const axios = require('axios');
const { generateLeaderData } = require('../../botCommands/mockData');

/* eslint-disable */
/* eslint max-classes-per-file: ["error", 2] */

class GuildMembersMock {
  members;

  cache;

  constructor(users) {
    this.members = users;
    this.cache = {
      get: (id) => users.filter((member) => member.discord_id === id)[0],
    };
  }
}

class GuildMock {
  members;

  member;

  constructor(users) {
    this.members = new GuildMembersMock(users);
    this.member = (user) => users.filter((member) => member === user)[0];
  }
}

describe('Reply the correct information for Server leaderboard', () => {
  let limit = null;
  let offset = null;
  const interactionMock = {
    options: {
      getSubcommand: () => 'ranking',
      getInteger: (string) => {
        if (string === 'limit') {
          return limit;
        } else if (string === "offset") {
          return offset;
        }
      }
    },
    reply: jest.fn((message) => expect(message).toMatchSnapshot())
  }

  afterEach(() => axios.get.mockReset());

  const setUpAxiosMock = (data) => axios.get = jest.fn().mockResolvedValue({ data });

  it.skip('Returns correct output if provided no options', () => {
    const members = generateLeaderData(5);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members)

    execute(interactionMock);
  });

  it.skip('Returns limits results to 25 if limit not provided', () => {
    const members = generateLeaderData(30);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    execute(interactionMock);
  });

  it.skip("Returned users matches limit", () => {
    limit = 8;
    const members = generateLeaderData(30);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    execute(interactionMock);
  })

  it.skip("Limit defaulst to 25 used if limit provided lower than 1", () => {
    limit = 0;
    const members = generateLeaderData(5);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);
    execute(interactionMock);
  })

  it.skip("Limit defaults to 25 when limit provided is higher than 25", () => {
    limit = 50;
    const members = generateLeaderData(70);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    execute(interactionMock);
  })

  it.skip("Retruns users starting from offset", () => {
    offset = 5;
    limit = 5;
    const members = generateLeaderData(50);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    execute(interactionMock);
  })

  //       expect(
  //         await commands.leaderboard.cb({
  //           guild: new GuildMock(members),
  //           content: '!leaderboard n=2 start=3',
  //         }),
  //       ).toMatchSnapshot();
  //       expect(
  //         await commands.leaderboard.cb({
  //           guild: new GuildMock(members),
  //           content: '!leaderboard start=3',
  //         }),
  //       ).toMatchSnapshot();
  //       expect(
  //         await commands.leaderboard.cb({
  //           guild: new GuildMock(members),
  //           content: '!leaderboard n=2',
  //         }),
  //       ).toMatchSnapshot();
  //       expect(
  //         await commands.leaderboard.cb({
  //           guild: new GuildMock(members),
  //           content: '!leaderboard n=2 start=wtf',
  //         }),
  //       ).toMatchSnapshot();
  //       expect(
  //         await commands.leaderboard.cb({
  //           guild: new GuildMock(members),
  //           content: '!leaderboard n=wtf start=3',
  //         }),
  //       ).toMatchSnapshot();
  //       expect(
  //         await commands.leaderboard.cb({
  //           guild: new GuildMock(members),
  //           content: '!leaderboard n=25 start=9999',
  //         }),
  //       ).toMatchSnapshot();
  //     });
  //   });
  // });

  // describe('!points', () => {
  //   const author = {
  //     id: '111333',
  //     displayName: 'odin'
  //   }
  //   const mentionedUser = {
  //     id: '222444',
  //     displayName: "NotOdin"
  //   };
  //
  //   const data = {
  //     author,
  //     guild: Guild([author, mentionedUser])
  //   }
  //
  //   describe('regex', () => {
  //     it.each([
  //       ['!points <@!123456789>'],
  //       ['let me check out my !points <@!123456789>'],
  //       ['!points <@!123456789> <@!123456789>-v2'],
  //       ['!points'],
  //     ])('correct strings trigger the callback', (string) => {
  //       expect(commands.points.regex.test(string)).toBeTruthy();
  //     });
  //
  //     it('returns author points information if no other user were provided', async () => {
  //       data.content = '!points';
  //       const axiosData = {
  //         data: {
  //           points: 5,
  //           rank: 1,
  //         }
  //       };
  //
  //       axios.get = jest.fn(() => axiosData);
  //       const reply = await commands.points.cb(data);
  //
  //       expect(reply).toMatchSnapshot();
  //       expect(axios.get).toHaveBeenCalled();
  //     });
  //
  //     it('return correct user points information if specified', async () => {
  //       data.content = '!points <@222444>';
  //       const axiosData = {
  //         data: {
  //           points: 20,
  //           rank: 1,
  //         }
  //       };
  //
  //       axios.get = jest.fn(() => axiosData);
  //       const reply = await commands.points.cb(data);
  //
  //       expect(reply).toMatchSnapshot();
  //       expect(axios.get).toHaveBeenCalled();
  //     });
  //
  //     it('returns correct msg when user has no points', async () => {
  //       data.content = '!points <@222444>';
  //       const axiosData = {
  //         data: {
  //           message: "unable to find that user",
  //         }
  //       };
  //
  //       axios.get = jest.fn(() => axiosData);
  //
  //       const reply = await commands.points.cb(data);
  //       expect(reply).toMatchSnapshot();
  //       expect(axios.get).toHaveBeenCalled();
  //     });
  //
  //     it('GET request not called if user not on disord', async () => {
  //       data.content = '!points <@11111111>';
  //
  //       axios.get = jest.fn();
  //       const reply = await commands.points.cb(data);
  //
  //       expect(reply).toMatchSnapshot();
  //       expect(axios.get).not.toHaveBeenCalled();
  //     });
  //
  //     it('format the points word properly for 1 point', async () => {
  //       data.content = '!points';
  //       const axiosData = {
  //         data: {
  //           points: 1,
  //           rank: 1,
  //         }
  //       }
  //
  //       axios.get = jest.fn(() => axiosData);
  //       const reply = await commands.points.cb(data);
  //
  //       expect(reply).toMatchSnapshot();
  //       expect(axios.get).toHaveBeenCalled();
  //     });
  //
  //     it('show correct user rank', async () => {
  //       data.content = '!points <@222444>';
  //       const axiosData = {
  //         data: {
  //           points: 20,
  //           rank: 50
  //         }
  //       };
  //
  //       axios.get = jest.fn(() => axiosData);
  //       const reply = await commands.points.cb(data);
  //
  //       expect(reply).toMatchSnapshot();
  //       expect(axios.get).toHaveBeenCalled();
  //     })
  //   });
  // });
});
