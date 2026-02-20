const mockSend = jest.fn((message) => message);

module.exports = {
  mockSend,
  discordMock: {
    Client: (users, channel, user) => ({
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
    }),
    Guild: (users) => ({
      members: {
        members: users,
        cache: {
          get: (id) => users.filter((member) => member.discord_id === id)[0],
        },
        fetch: (user) => user,
      },
      roles: {
        cache: [{ name: 'club-40' }],
      },
      member: (user) => users.filter((member) => member === user)[0],
    }),
    Channel: (id) => ({
      id,
      send: mockSend,
    }),
    User: (roles, id, points) => ({
      roles: {
        add: () => {
          roles.push('club-40');
        },
        cache: roles,
      },
      id: `<@${id}>`,
      points,
      toString: () => `<@${id}>`,
    }),
    Member: (roles) => ({
      roles: {
        cache: roles,
      },
    }),
  },
};
