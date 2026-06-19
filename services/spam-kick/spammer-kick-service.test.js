const SpamKickingService = require('./spammer-kick-service');
const { GuildMember, Guild, Role } = require('../../utils/mocks/discord');
const config = require('../../config');

beforeAll(() => {
  jest.useFakeTimers();
  // Date.UTC Required so that test snippets match on different timezones
  jest.setSystemTime(new Date(Date.UTC(2024, 1, 1)));
});

afterAll(() => {
  jest.useRealTimers();
});

function createMemberMock(guild, role) {
  const id = '123';
  const roles = [role];
  const username = 'bad.spammer';
  return new GuildMember({ id, username, guild, roles });
}

describe('Kicking spammer', () => {
  let member;
  beforeEach(() => {
    const guild = new Guild();
    member = createMemberMock(guild, new Role('0', 'casual-user'));
  });

  it('Kicks spammer service kicks with correct message', async () => {
    await SpamKickingService.kick(member);
    expect(member.kick).toHaveBeenCalledTimes(1);
    expect(member.kick.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Kicked spammer is informed about the kick in DM', async () => {
    await SpamKickingService.kick(member);
    expect(member.send).toHaveBeenCalledTimes(1);
    expect(member.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Kicks spammer even if their DM is disabled', async () => {
    member.send = jest.fn(() => {
      throw new Error("Can't contact user");
    });
    await SpamKickingService.kick(member);
    expect(member.kick).toHaveBeenCalledTimes(1);
    expect(member.send).toHaveBeenCalledTimes(1);
    expect(member.kick.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Kicked spammer info is logged in moderation channel', async () => {
    await SpamKickingService.kick(member);
    member.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLog.id) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.send.mock.calls[0][0]).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalled();
      }
    });
  });

  it('Does not kick admin roles', async () => {
    console.error = jest.fn();
    const guild = new Guild();
    const member = createMemberMock(guild, Role.admin);
    await SpamKickingService.kick(member);
    expect(member.send).not.toHaveBeenCalled();
    expect(member.kick).not.toHaveBeenCalled();
    member.guild.channels.cache.forEach((channel) => {
      expect(channel.send).not.toHaveBeenCalled();
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
    console.error.mockClear();
  });
});

describe('Warning spammer', () => {
  let member;
  beforeEach(() => {
    const guild = new Guild();
    member = createMemberMock(guild, new Role('0', 'casual-user'));
  });

  it('Warned spammer is informed about the warning in DM', async () => {
    await SpamKickingService.warn(member);
    expect(member.send).toHaveBeenCalledTimes(1);
    expect(member.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Warning is logged in moderation channel', async () => {
    await SpamKickingService.warn(member);
    member.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLog.id) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.send.mock.calls[0][0]).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalled();
      }
    });
  });

  it('Does not warn admin roles', async () => {
    console.error = jest.fn();
    const guild = new Guild();
    const member = createMemberMock(guild, Role.admin);
    await SpamKickingService.warn(member);
    expect(member.send).not.toHaveBeenCalled();
    member.guild.channels.cache.forEach((channel) => {
      expect(channel.send).not.toHaveBeenCalled();
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
    console.error.mockClear();
  });

  it('Warns spammer even if their DM is disabled', async () => {
    member.send = jest.fn(() => {
      throw new Error("Can't contact user");
    });
    await SpamKickingService.warn(member);
    expect(member.send).toHaveBeenCalledTimes(1);
    member.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLogChannelId) {
        expect(channel.send).toHaveBeenCalledTimes(1);
      }
    });
  });
});
