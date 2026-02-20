const mockSend = jest.fn((message) => message);

module.exports = {
  mockSend,
  discordMock: {
    ...jest.requireActual('discord.js'),
    Client: jest.fn((users, channel, user) => ({
      channels: {
        cache: {
          get: () => channel,
        },
      },
      users: {
        cache: {
          get: (userId) =>
            users.filter(
              (filteredUser) => `<@${userId}>` === filteredUser.id,
            )[0],
        },
      },
      user,
    })),
    Guild: jest.fn((users) => ({
      members: {
        members: users,
        cache: {
          get: (id) => users.filter((member) => member.discord_id === id)[0],
        },
        fetch: jest.fn((user) => user),
      },
      roles: {
        cache: [{ name: 'club-40' }],
      },
      member: (user) => users.filter((member) => member === user)[0],
    })),
    Channel: jest.fn((id) => ({
      id,
      send: mockSend,
    })),
    User: jest.fn((roles, id, points) => ({
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
    Member: jest.fn((roles) => ({
      roles: {
        cache: roles,
      },
    })),
  },
};
