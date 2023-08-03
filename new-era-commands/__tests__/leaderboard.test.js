const axios = require('axios');
const { execute } = require('../slash/leaderboard');
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

describe('ranking subcommand', () => {
  let limit = null;
  let offset = null;
  let reply = '';
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
    reply: jest.fn((message) => reply = message)
  }

  const setUpAxiosMock = (data) => axios.get = jest.fn().mockResolvedValue({ data });

  afterEach(() => {
    limit = null;
    offset = null;
    axios.get.mockReset();
  })

  it("Returned users length matches limit", async () => {
    limit = 8;
    const members = generateLeaderData(30);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await execute(interactionMock);
    expect(reply).toMatchSnapshot();
  })

  it('Limit defaults to 25 if limit not provided', async () => {
    const members = generateLeaderData(30);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await execute(interactionMock);
    expect(reply).toMatchSnapshot();
  });

  it('Limit defaults to 25 if invalid characters provided', async () => {
    limit = 'sdfsdf';
    const members = generateLeaderData(30);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await execute(interactionMock);
    expect(reply).toMatchSnapshot();
  });

  it("Limit defaults to 25 used if limit provided lower than 1", async () => {
    limit = 0;
    const members = generateLeaderData(25);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await execute(interactionMock);
    expect(reply).toMatchSnapshot();
  })

  it("Limit defaults to 25 when limit provided is higher than 25", async () => {
    limit = 50;
    const members = generateLeaderData(70);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await execute(interactionMock);
    expect(reply).toMatchSnapshot();
  })

  it("Returns users starting from offset", async () => {
    offset = 5;
    const members = generateLeaderData(50);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(reply).toMatchSnapshot();
  })

  it("Offset defaults to 0 if not provided", async () => {
    const members = generateLeaderData(25);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(reply).toMatchSnapshot();
  })

  it("Offset defaults to 0 if invalid characters provided", async () => {
    offset = 'sdfs';
    const members = generateLeaderData(25);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(reply).toMatchSnapshot();
  })

  it("Offset defaults to 0 if negative value provided", async () => {
    offset = -5;
    const members = generateLeaderData(25);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(reply).toMatchSnapshot();
  })

  it("Offset cannot exceed max users length", async () => {
    offset = 70;
    const members = generateLeaderData(50);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(reply).toMatchSnapshot();
  })

  it("Offset show the last users depending on limit if offset is too high", async () => {
    offset = 56;
    limit = 5;
    const members = generateLeaderData(50);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(reply).toMatchSnapshot();
  })

  it("Return the correct limit, moving offset backward if necessary", async () => {
    offset = 56;
    limit = 10;
    const members = generateLeaderData(60);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(reply).toMatchSnapshot();
  })
});


describe('user subcommand', () => {
  let limit = null;
  let offset = null;
  let reply = '';

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
    reply: jest.fn((message) => reply = message)
  }


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
