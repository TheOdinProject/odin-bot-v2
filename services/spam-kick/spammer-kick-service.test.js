const SpamKickingService = require('./spammer-kick-service');
const {
  GuildMember,
  TextChannel,
  Guild,
  Role,
} = require('../../utils/mocks/discord');
const config = require('../../config');

beforeAll(() => {
  jest.useFakeTimers();
  // Date.UTC Required so that test snippets match on different timezones
  jest.setSystemTime(new Date(Date.UTC(2024, 1, 1)));
});

afterAll(() => {
  jest.useRealTimers();
});

function getChannels() {
  return [
    new TextChannel(config.channels.moderationLogChannelId),
    new TextChannel('101010'),
    new TextChannel('22223333'),
    new TextChannel('2302382'),
    new TextChannel('000000'),
  ];
}

function createMemberMock(guild, roleName) {
  const id = '123';
  const roles = [new Role(0, roleName)];
  const username = 'bad.spammer';
  return new GuildMember({ id, username, guild, roles });
}

describe('Kicking spammer', () => {
  let member;
  beforeEach(() => {
    const guild = new Guild({ channels: getChannels() });
    member = createMemberMock(guild, 'casual-user');
  });

  it('Kicks spammer service kicks with correct message', async () => {
    await SpamKickingService.kick(member, 3, 'buy cheap stuff now');
    expect(member.kick).toHaveBeenCalledTimes(1);
    expect(member.kick.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Kicked spammer is informed about the kick in DM', async () => {
    await SpamKickingService.kick(member, 3, 'buy cheap stuff now');
    // First call: notification message. Second call: deleted message content.
    expect(member.send).toHaveBeenCalledTimes(2);
    expect(member.send.mock.calls[0][0]).toMatchSnapshot();
    expect(member.send.mock.calls[1][0]).toBe('buy cheap stuff now');
  });

  it('sends deleted message content that fits in one DM as a single chunk', async () => {
    const content = 'a'.repeat(2000);
    await SpamKickingService.kick(member, 3, content);
    expect(member.send).toHaveBeenCalledTimes(2);
    expect(member.send.mock.calls[1][0]).toBe(content);
  });

  it('splits deleted message content over 2000 characters into multiple DMs', async () => {
    const content = 'a'.repeat(4500);
    await SpamKickingService.kick(member, 3, content);
    // 1 notification + 3 content chunks (2000 + 2000 + 500)
    expect(member.send).toHaveBeenCalledTimes(4);
    expect(member.send.mock.calls[1][0]).toBe('a'.repeat(2000));
    expect(member.send.mock.calls[2][0]).toBe('a'.repeat(2000));
    expect(member.send.mock.calls[3][0]).toBe('a'.repeat(500));
  });

  it('Kicks spammer even if their DM is disabled', async () => {
    member.send = jest.fn(() => {
      throw new Error("Can't contact user");
    });
    await SpamKickingService.kick(member, 3, 'buy cheap stuff now');
    expect(member.kick).toHaveBeenCalledTimes(1);
    expect(member.send).toHaveBeenCalledTimes(2);
    expect(member.kick.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Kicked spammer info is logged in moderation channel', async () => {
    await SpamKickingService.kick(member, 3, 'buy cheap stuff now');
    member.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLogChannelId) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.send.mock.calls[0][0]).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalled();
      }
    });
  });

  it('Does not kick admin roles', async () => {
    console.error = jest.fn();
    const guild = new Guild({ channels: getChannels() });
    const member = createMemberMock(guild, 'admin');
    await SpamKickingService.kick(member, 3, 'buy cheap stuff now');
    expect(member.send).not.toHaveBeenCalled();
    expect(member.kick).not.toHaveBeenCalled();
    member.guild.channels.cache.forEach((channel) => {
      expect(channel.send).not.toHaveBeenCalled();
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
    console.error.mockClear();
  });

  it("Error is handled if channel doesn't exist", async () => {
    console.error = jest.fn();
    const channels = [new TextChannel('1234')];
    const guild = new Guild({ channels });
    member = createMemberMock(guild, 'james-bond');
    await SpamKickingService.kick(member, 3, 'buy cheap stuff now');

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toBeInstanceOf(Error);
    console.error.mockClear();
  });
});

describe('Warning spammer', () => {
  let member;
  beforeEach(() => {
    const guild = new Guild({ channels: getChannels() });
    member = createMemberMock(guild, 'casual-user');
  });

  it('Warned spammer is informed about the warning in DM', async () => {
    await SpamKickingService.warn(member, 3, 'buy cheap stuff now');
    expect(member.send).toHaveBeenCalledTimes(2);
    expect(member.send.mock.calls[0][0]).toMatchSnapshot();
    expect(member.send.mock.calls[1][0]).toBe('buy cheap stuff now');
  });

  it('sends deleted message content that fits in one DM as a single chunk', async () => {
    const content = 'a'.repeat(2000);
    await SpamKickingService.warn(member, 3, content);
    expect(member.send).toHaveBeenCalledTimes(2);
    expect(member.send.mock.calls[1][0]).toBe(content);
  });

  it('splits deleted message content over 2000 characters into multiple DMs', async () => {
    const content = 'a'.repeat(4500);
    await SpamKickingService.warn(member, 3, content);
    expect(member.send).toHaveBeenCalledTimes(4);
    expect(member.send.mock.calls[1][0]).toBe('a'.repeat(2000));
    expect(member.send.mock.calls[2][0]).toBe('a'.repeat(2000));
    expect(member.send.mock.calls[3][0]).toBe('a'.repeat(500));
  });

  it('Warning is logged in moderation channel', async () => {
    await SpamKickingService.warn(member, 3, 'buy cheap stuff now');
    member.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLogChannelId) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.send.mock.calls[0][0]).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalled();
      }
    });
  });

  it('Does not warn admin roles', async () => {
    console.error = jest.fn();
    const guild = new Guild({ channels: getChannels() });
    const member = createMemberMock(guild, 'admin');
    await SpamKickingService.warn(member, 3, 'buy cheap stuff now');
    expect(member.send).not.toHaveBeenCalled();
    member.guild.channels.cache.forEach((channel) => {
      expect(channel.send).not.toHaveBeenCalled();
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
    console.error.mockClear();
  });

  it('logs DM failure to moderation channel and still logs the warning action', async () => {
    member.send = jest.fn(() => {
      throw new Error("Can't contact user");
    });
    await SpamKickingService.warn(member, 3, 'buy cheap stuff now');
    expect(member.send).toHaveBeenCalledTimes(2);
    member.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLogChannelId) {
        expect(channel.send).toHaveBeenCalledTimes(3);
      }
    });
  });

  it("Error is handled if channel doesn't exist", async () => {
    console.error = jest.fn();
    const channels = [new TextChannel('1234')];
    const guild = new Guild({ channels });
    member = createMemberMock(guild, 'james-bond');
    await SpamKickingService.warn(member, 3, 'buy cheap stuff now');

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toBeInstanceOf(Error);
    console.error.mockClear();
  });
});
