module.exports = {
  Client: ({ users, channel, user }) => ({
    channels: {
      cache: {
        get: () => channel,
      },
    },
    users: {
      cache: {
        get: (userId) =>
          users.filter((filteredUser) => `<@${userId}>` === filteredUser.id)[0],
      },
    },
    user,
  }),
  Guild: ({ users }) => ({
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
  }),
  Channel: (id) => ({
    id,
    send: jest.fn((message) => message),
  }),
  User: ({ id, points, roles = [] }) => {
    const discordIdString = `<@${id}>`;
    return {
      roles: {
        add: (role) => {
          roles.push(role);
        },
        cache: roles,
      },
      id: discordIdString,
      points,
      toString: () => discordIdString,
    };
  },
  Member: ({ roles }) => ({
    roles: {
      cache: roles,
    },
  }),
};
