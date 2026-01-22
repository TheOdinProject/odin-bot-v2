function getUsers(count, start = 0) {
  const users = [
    { id: '1234', username: 'Foo', nickname: '' },
    { id: '5678', username: 'Baz', nickname: '' },
    { id: '9101', username: 'Bang', nickname: '' },
    { id: '1121', username: 'Bing', nickname: '' },
    { id: '3141', username: 'Bong', nickname: '' },
    { id: '5161', username: 'Ding', nickname: '' },
  ];

  if (start > 0) {
    return users.slice(start, count + start);
  }

  if (count) {
    return users.slice(start, count);
  }

  return users.slice(start);
}

function buildInteractionUsers(usersArray) {
  return usersArray.reduce((acc, user, index) => {
    acc[`user${index}`] = user;
    return acc;
  }, {});
}

function buildInteraction(subcommand, guild, usersArray, reply) {
  const users = buildInteractionUsers(usersArray);
  return {
    options: {
      getSubcommand: () => subcommand,
      getUser: (name) => users[name],
    },
    guild,
    reply,
  };
}

function initializeServer(usersArray) {
  const users = usersArray || getUsers();
  const usersById = users.reduce((acc, user) => {
    const { id, username, nickname } = user;
    acc[id] = { user: { username }, nickname };
    return acc;
  }, {});

  return {
    members: {
      fetch: (id) => usersById[id],
    },
  };
}

module.exports = {
  buildInteraction,
  getUsers,
  initializeServer,
};
