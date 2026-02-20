/**
 * We do not need to mock the actual Discord.js module with these features
 * as we are only unit testing individual callbacks, and just need
 * appropriate arguments.
 *
 * We would only need to mock the actual Discord.js module with these
 * if we were able to write integration tests.
 * However, this would be incredibly complex, requiring a lot of mocking
 * of Discord.js' internals like events, API calls etc.
 * Not worth it for the complexity and maintenance costs.
 *
 * Since these are just Discord internals,none of our callbacks should
 * need to use any of these directly.
 */
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
