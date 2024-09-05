const axios = require('axios');
const PointsService = require('./points.service');
const { generateLeaderData, generateLeaderDataWithMarkdown } = require('../../botCommands/mockData');

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

describe('leaderboard subcommand', () => {
  let limit = null;
  let offset = null;
  let reply = '';
  const interactionMock = {
    options: {
      getSubcommand: () => 'leaderboard',
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
    reply = '';
    axios.get.mockReset();
  })

  it("Returns be the first to earn points message if no user in database", async () => {
    const members = generateLeaderData(0);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })


  it("Returned users length matches limit", async () => {
    limit = 8;
    const members = generateLeaderData(30);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it('Limit defaults to 5 if limit not provided', async () => {
    const members = generateLeaderData(30);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });

  it('Limit defaults to 5 if invalid characters provided', async () => {
    limit = 'sdfsdf';
    const members = generateLeaderData(30);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });

  it("Limit defaults to 5 if limit provided lower than 1", async () => {
    limit = 0;
    const members = generateLeaderData(25);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Limit defaults to 25 if limit provided is higher than 25", async () => {
    limit = 50;
    const members = generateLeaderData(70);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it('Limit does not exceed users length', async () => {
    limit = 10;
    const members = generateLeaderData(5);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Members who left are filtered out", async () => {
    const members = generateLeaderData(50);
    const limitMembers = members.slice(20, 40);
    interactionMock.guild = new GuildMock(limitMembers);
    setUpAxiosMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Returns users starting from offset", async () => {
    offset = 5;
    const members = generateLeaderData(50);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Offset defaults to 0 if not provided", async () => {
    const members = generateLeaderData(25);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Offset defaults to 0 if invalid characters provided", async () => {
    offset = 'sdfs';
    const members = generateLeaderData(25);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Offset defaults to 0 if negative value provided", async () => {
    offset = -5;
    const members = generateLeaderData(25);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Offset cannot exceed max users length", async () => {
    offset = 70;
    const members = generateLeaderData(50);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Offset show the last users depending on limit if offset is too high", async () => {
    offset = 56;
    limit = 5;
    const members = generateLeaderData(50);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Return the correct limit, moving offset backward if necessary", async () => {
    offset = 56;
    limit = 10;
    const members = generateLeaderData(60);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("escapes markdown correctly", async () => {
    const members = generateLeaderDataWithMarkdown(5);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });
});


describe('user subcommand', () => {
  const apiData = [
    { id: 7, discord_id: '7777', points: 4000 }, // Left Server
    { id: 6, discord_id: '6666', points: 3000 }, // Cat
    { id: 5, discord_id: '5555', points: 2000 }, // Left Server
    { id: 3, discord_id: '3333', points: 1000 }, // Dog
    { id: 2, discord_id: '2222', points: 20 }, // Someone
    { id: 4, discord_id: '4444', points: 15 }, // Tree
    { id: 1, discord_id: '1111', points: 1 }, // NotOdin
  ]

  const guildMock = new GuildMock([
    { displayName: 'NotOdin', discord_id: '1111' },
    { displayName: 'Someone', discord_id: '2222' },
    { displayName: 'Dog', discord_id: '3333' },
    { displayName: 'Tree', discord_id: '4444' },
    { displayName: 'Cat', discord_id: '6666' }
  ])

  beforeEach(() => {
    axios.get = jest.fn().mockResolvedValue({ data: apiData });
  })

  let user = {}; // created for each test each test
  let reply = '';
  const interactionMock = {
    guild: guildMock,
    options: {
      getSubcommand: () => 'user',
      getUser: () => user,
    },
    reply: jest.fn((message) => reply = message)
  }

  afterEach(() => {
    reply = '';
    user = {};
  });

  it('Return correct reply when user is not in database', async () => {
    user = { id: '200', username: 'OldUser' };

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });

  it('Return correct rank for user ignoring members that has left', async () => {
    user = { id: '3333', username: 'Dog' };

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();

    user = { id: '2222', username: 'Someone' };

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();

    user = { id: '4444', username: 'Tree' };

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });

  it('Rank append emoji to first ranked user', async () => {
    user = { id: '6666', username: 'Cat' };

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });

  it('Format the points word properly for 1 point', async () => {
    user = { id: '1111', username: 'NotOdin' };

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });

  it("Formats the points word properly for 0 points", async () => {
    user = { id: '9292', username: 'OldestUser' };

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });

  it("Formats the points word correctly for more than 1 points", async () => {
    user = { id: '3333', username: 'Dog' };

    await PointsService.handleInteraction(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });
});
