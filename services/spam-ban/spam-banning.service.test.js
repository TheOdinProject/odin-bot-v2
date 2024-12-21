const SpamBanningService = require('./spam-banning.service');
const config = require('../../config');

beforeAll(() => {
  jest.useFakeTimers();
  // Date.UTC Required so that test snippets match on different timezones
  jest.setSystemTime(new Date(Date.UTC(2024, 1, 1)));
});

afterAll(() => {
  jest.useRealTimers();
});

function createInteractionMock(message, guild) {
  let replyArg;

  return {
    reply: jest.fn((arg) => {
      replyArg = arg;
    }),
    guild,
    message,

    // The mod who initialized the interaction
    user: {
      id: '007',
    },

    // Used by service to retrieve the message
    options: { getMessage: () => message },

    getReplyArg: () => replyArg,
    getAuthorSendArg: () => message.getSendArg(),
    getBanArg: () => message.getBanArg(),
    getReactArg: () => message.getReactArg(),
    getChannelSendArg: () =>
      guild.channels.cache
        .find((c) => c.id === config.channels.moderationLogChannelId)
        .getSendArg(),
  };
}

function createMessageMock() {
  let sendArg;
  let banArg;
  let reactArg;

  return {
    author: {
      id: '123',
      username: 'bad.spammer',
      bot: false,
      send: jest.fn((arg) => {
        sendArg = arg;
      }),
      displayAvatarURL: () => 'image.jpg',
    },
    member: {
      roles: {
        cache: [],
      },
      ban: jest.fn((arg) => {
        banArg = arg;
      }),
    },
    react: jest.fn((arg) => {
      reactArg = arg;
    }),
    channel: {
      id: config.channels.automodBlockChannelId
    },
    getSendArg: () => sendArg,
    getBanArg: () => banArg,
    getReactArg: () => reactArg,
  };
}

function createChannelMock(id) {
  let sendArg;
  return {
    id,
    send: jest.fn((arg) => {
      sendArg = arg;
    }),
    getSendArg: () => sendArg,
  };
}

function createGuildMock() {
  const channels = {
    cache: [
      createChannelMock(config.channels.moderationLogChannelId),
      createChannelMock(config.channels.automodBlockChannelId),
      createChannelMock('101010'),
      createChannelMock('22223333'),
      createChannelMock('2302382'),
      createChannelMock('000000'),

    ],
    fetch: (id) => channels.cache.find(c => c.id === id)
  };

  return {
    channels,
  };
}

describe('Banning spammer with DM enabled', () => {
  let interactionMock;
  beforeEach(() => {
    const messageMock = createMessageMock();
    const guildMock = createGuildMock();
    interactionMock = createInteractionMock(messageMock, guildMock);
  });

  it('Discord ban api is called with the correct reason', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.member.ban).toHaveBeenCalledTimes(1);
    expect(interactionMock.getBanArg()).toMatchSnapshot();
  });

  it('Discord message api is called with the correct message', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.author.send).toHaveBeenCalledTimes(1);
    expect(interactionMock.getAuthorSendArg()).toMatchSnapshot();
  });

  it('Reacts with the correct emoji', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.react).toHaveBeenCalledTimes(1);
    expect(interactionMock.getReactArg()).toMatchSnapshot();
  });

  it('Sends log to the correct channel', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    interactionMock.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLogChannelId) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(interactionMock.getChannelSendArg()).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalledTimes(1);
      }
    });
  });

  it('Sends back correct interaction reply to calling moderator', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });
});

describe('Banning spammer who has DM set to private', () => {
  let interactionMock;
  beforeEach(() => {
    const messageMock = createMessageMock();
    const guildMock = createGuildMock();
    messageMock.author.send = jest.fn(() => {
      throw new Error("Can't contact user");
    });
    interactionMock = createInteractionMock(messageMock, guildMock);
  });

  it('Discord ban api is called with the correct reason', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.member.ban).toHaveBeenCalledTimes(1);
    expect(interactionMock.getBanArg()).toMatchSnapshot();
  });

  it('Discord message api is called and error handled', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.author.send).toHaveBeenCalledTimes(1);
  });

  it('Reacts with the correct emoji', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.react).toHaveBeenCalledTimes(1);
    expect(interactionMock.getReactArg()).toMatchSnapshot();
  });

  it('Sends log to the correct channel', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    interactionMock.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLogChannelId) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.getSendArg()).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalledTimes(1);
      }
    });
  });

  it('Sends back correct interaction reply to calling moderator', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });
});

describe('Banning spammer that has left the server', () => {
  let interactionMock;
  beforeEach(() => {
    const messageMock = createMessageMock();
    const guildMock = createGuildMock();
    messageMock.member = null;
    interactionMock = createInteractionMock(messageMock, guildMock);
  });

  it('Author message sending api is not called', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.author.send).not.toHaveBeenCalled();
  });

  it('Reacts with the correct emoji to automod message', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.react).toHaveBeenCalledTimes(1);
    expect(interactionMock.getReactArg()).toMatchSnapshot();
  });

  it('Does not log any channel', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    interactionMock.guild.channels.cache.forEach((channel) => {
      expect(channel.send).not.toHaveBeenCalled();
    });
  });

  it('Sends back correct interaction reply to calling moderator', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });
});

describe('Attempting to ban a bot or team member', () => {
  let interactionMock;
  beforeEach(() => {
    const messageMock = createMessageMock();
    const guildMock = createGuildMock();
    interactionMock = createInteractionMock(messageMock, guildMock);
  });

  it('Does not ban bots', async () => {
    interactionMock.message.author.bot = true;
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.member.ban).not.toHaveBeenCalled();
    expect(interactionMock.message.author.send).not.toHaveBeenCalled();
    expect(interactionMock.message.react).not.toHaveBeenCalled();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });

  it('Does not ban moderators', async () => {
    interactionMock.message.member.roles.cache = [{ name: 'moderator' }];
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.member.ban).not.toHaveBeenCalled();
    expect(interactionMock.message.author.send).not.toHaveBeenCalled();
    expect(interactionMock.message.react).not.toHaveBeenCalled();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });

  it('Does not ban maintainers', async () => {
    interactionMock.message.member.roles.cache = [{ name: 'maintainer' }];
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.member.ban).not.toHaveBeenCalled();
    expect(interactionMock.message.author.send).not.toHaveBeenCalled();
    expect(interactionMock.message.react).not.toHaveBeenCalled();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });

  it('Does not ban core', async () => {
    interactionMock.message.member.roles.cache = [{ name: 'core' }];
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.member.ban).not.toHaveBeenCalled();
    expect(interactionMock.message.author.send).not.toHaveBeenCalled();
    expect(interactionMock.message.react).not.toHaveBeenCalled();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });

  it('Does not ban admins', async () => {
    interactionMock.message.member.roles.cache = [{ name: 'admin' }];
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.member.ban).not.toHaveBeenCalled();
    expect(interactionMock.message.author.send).not.toHaveBeenCalled();
    expect(interactionMock.message.react).not.toHaveBeenCalled();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });
});

describe('Attempting to log banned user in moderation log channel', () => {
  let interactionMock;
  beforeEach(() => {
    const messageMock = createMessageMock();
    const guildMock = createGuildMock();
    interactionMock = createInteractionMock(messageMock, guildMock);
  });

  it('Sends log to the correct channel', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    interactionMock.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLogChannelId) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(interactionMock.getChannelSendArg()).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalledTimes(1);
      }
    });
  });

  it("Error is handled if channel doesn't exist", async () => {
    console.error = jest.fn();
    interactionMock.guild.channels.fetch = async () => null;
    await SpamBanningService.handleInteraction(interactionMock);
    interactionMock.guild.channels.cache.forEach((channel) => {
      expect(channel.send).not.toHaveBeenCalledTimes(1);
    });
    expect(console.error).toHaveBeenCalledTimes(1);
    console.error.mockClear();
  });
});
