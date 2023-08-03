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
    reply = '';
    axios.get.mockReset();
  })

  it("Returns be the first to earn points message if no user in database", async () => {
    const members = generateLeaderData(0);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })


  it("Returned users length matches limit", async () => {
    limit = 8;
    const members = generateLeaderData(30);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it('Limit defaults to 25 if limit not provided', async () => {
    const members = generateLeaderData(30);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });

  it('Limit defaults to 25 if invalid characters provided', async () => {
    limit = 'sdfsdf';
    const members = generateLeaderData(30);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });

  it("Limit defaults to 25 if limit provided lower than 1", async () => {
    limit = 0;
    const members = generateLeaderData(25);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Limit defaults to 25 if limit provided is higher than 25", async () => {
    limit = 50;
    const members = generateLeaderData(70);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it('Limit does not exceed users length', async () => {
    limit = 10;
    const members = generateLeaderData(5);
    interactionMock.guild = new GuildMock(members);
    setUpAxiosMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })


  it("Returns users starting from offset", async () => {
    offset = 5;
    const members = generateLeaderData(50);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Offset defaults to 0 if not provided", async () => {
    const members = generateLeaderData(25);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Offset defaults to 0 if invalid characters provided", async () => {
    offset = 'sdfs';
    const members = generateLeaderData(25);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Offset defaults to 0 if negative value provided", async () => {
    offset = -5;
    const members = generateLeaderData(25);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Offset cannot exceed max users length", async () => {
    offset = 70;
    const members = generateLeaderData(50);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Offset show the last users depending on limit if offset is too high", async () => {
    offset = 56;
    limit = 5;
    const members = generateLeaderData(50);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })

  it("Return the correct limit, moving offset backward if necessary", async () => {
    offset = 56;
    limit = 10;
    const members = generateLeaderData(60);
    setUpAxiosMock(members);
    interactionMock.guild = new GuildMock(members);

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })
});


describe('user subcommand', () => {
  let user = {};
  let reply = '';
  const interactionMock = {
    options: {
      getSubcommand: () => 'user',
      getUser: () => user,
    },
    reply: jest.fn((message) => reply = message)
  }

  const setUpAxiosMock = (data) => axios.get = jest.fn().mockResolvedValue({ data });

  afterEach(() => {
    reply = '';
    user = {};
    axios.get.mockReset();
  })

  it('Return correct reply when user is not in database', async () => {
    setUpAxiosMock({ message: 'unable to find that user' })
    user = { id: '222444', username: 'NotOdin' };

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });

  it('Format the points word properly for 1 point', async () => {
    setUpAxiosMock({ points: 1 })
    user = { id: '235234', username: 'Someone' };

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  });

  it("Formats the points word properly for 0 or more than 1", async () => {
    setUpAxiosMock({ points: 20 })
    user = { id: '62323', username: 'Dog' };

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();


    setUpAxiosMock({ points: 0 })
    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })


  it('Return correct rank if user rank recieved', async () => {
    setUpAxiosMock({ points: 20, rank: 5 })
    user = { id: '55324', username: 'Cat' };

    await execute(interactionMock);
    expect(axios.get).toHaveBeenCalled();
    expect(reply).toMatchSnapshot();
  })
});
