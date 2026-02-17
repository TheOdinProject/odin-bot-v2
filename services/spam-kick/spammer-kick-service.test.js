const SpamKickingService = require('./spammer-kick-service');
const config = require('../../config');

beforeAll(() => {
  jest.useFakeTimers();
  // Date.UTC Required so that test snippets match on different timezones
  jest.setSystemTime(new Date(Date.UTC(2024, 1, 1)));
});

afterAll(() => {
  jest.useRealTimers();
});

function createChannelMock(id) {
  let sendMessage;
  return {
    id,
    send: jest.fn((message) => {
      sendMessage = message;
    }),
    getSendMessage: () => sendMessage,
  };
}

function createGuildMock() {
  const channels = {
    cache: [
      createChannelMock(config.channels.moderationLogChannelId),
      createChannelMock('101010'),
      createChannelMock('22223333'),
      createChannelMock('2302382'),
      createChannelMock('000000'),
    ],
    fetch: (id) => channels.cache.find((c) => c.id === id),
  };
  return {
    channels,
  };
}

function createMember(guild, roleId) {
  let sendMessage;
  let kickReason;
  return {
    guild,
    id: '123',
    user: { username: 'bad.spammer' },
    roles: {
      cache: { get: () => roleId },
    },
    send: jest.fn((message) => {
      sendMessage = message;
    }),
    displayAvatarURL: () => 'image.jpg',
    kick: jest.fn((reason) => {
      kickReason = reason;
    }),
    getKickReason: () => kickReason,
    getSendMessage: () => sendMessage,
    getChannelSendMessage: () =>
      guild.channels.cache
        .find((c) => c.id === config.channels.moderationLogChannelId)
        .getSendMessage(),
  };
}

describe('Kicking spammer', () => {
  let oldMemberState;
  let newMemberState;
  beforeEach(() => {
    // We run send, kick and channels operations on newMemberState only
    oldMemberState = createMember();
    newMemberState = createMember(createGuildMock(), config.roles.muted);
  });

  it('Kicks member after receiving muted role', async () => {
    await SpamKickingService.handleRoleUpdateEvent(
      oldMemberState,
      newMemberState,
    );
    expect(newMemberState.kick).toHaveBeenCalledTimes(1);
    expect(newMemberState.getKickReason()).toMatchSnapshot();
  });

  it('Kicked member is informed about the kick in DM', async () => {
    await SpamKickingService.handleRoleUpdateEvent(
      oldMemberState,
      newMemberState,
    );
    expect(newMemberState.send).toHaveBeenCalledTimes(1);
    expect(newMemberState.getSendMessage()).toMatchSnapshot();
  });

  it('Kicked member is logged in moderation channel', async () => {
    await SpamKickingService.handleRoleUpdateEvent(
      oldMemberState,
      newMemberState,
    );
    newMemberState.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLogChannelId) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(newMemberState.getChannelSendMessage()).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalled();
      }
    });
  });

  it("Error is handled if channel doesn't exist", async () => {
    console.error = jest.fn();
    newMemberState.guild.channels.fetch = async () => null;
    await SpamKickingService.handleRoleUpdateEvent(
      oldMemberState,
      newMemberState,
    );
    newMemberState.guild.channels.cache.forEach((channel) => {
      expect(channel.send).not.toHaveBeenCalled();
    });
    expect(console.error).toHaveBeenCalledTimes(1);
    console.error.mockClear();
  });
});
