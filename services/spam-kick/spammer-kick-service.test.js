const SpamKickingService = require('./spammer-kick-service');
const {
  GuildMember,
  TextChannel,
  Guild,
  Role,
  User,
} = require('../../utils/mocks/discord');
const config = require('../../config');

const ROLE_ID = config.roles.autoKick;

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

function createMemberMock(guild, roleId) {
  const id = '123';
  const roles = [new Role(roleId, 'auto-kick')];
  const user = new User({ username: 'bad.spammer' });
  return new GuildMember({ id, guild, roles, user });
}

// Note: SpamKickingService will call member methods (kick, send) are being done on the newMemberState
// oldmMemberState are only being used to call (roles.cache.get) in order to compare the past, and new roles.
describe('Kicking spammer', () => {
  let oldMemberState;
  let newMemberState;
  beforeEach(() => {
    const guild = new Guild({ channels: getChannels() });
    oldMemberState = createMemberMock(guild);
    newMemberState = createMemberMock(guild, ROLE_ID);
  });

  it('Kicks member after receiving muted role', async () => {
    await SpamKickingService.handleRoleUpdateEvent(
      oldMemberState,
      newMemberState,
    );
    expect(newMemberState.kick).toHaveBeenCalledTimes(1);
    expect(newMemberState.kick.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Kicks member even if their DM is disabled', async () => {
    newMemberState.send = jest.fn(() => {
      throw new Error("Can't contact user");
    });
    await SpamKickingService.handleRoleUpdateEvent(
      oldMemberState,
      newMemberState,
    );
    expect(newMemberState.kick).toHaveBeenCalledTimes(1);
    expect(newMemberState.send).toHaveBeenCalledTimes(1);
    expect(newMemberState.kick.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Kicked member is informed about the kick in DM', async () => {
    await SpamKickingService.handleRoleUpdateEvent(
      oldMemberState,
      newMemberState,
    );
    expect(newMemberState.send).toHaveBeenCalledTimes(1);
    expect(newMemberState.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Kicked member is logged in moderation channel', async () => {
    await SpamKickingService.handleRoleUpdateEvent(
      oldMemberState,
      newMemberState,
    );
    newMemberState.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLogChannelId) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.send.mock.calls[0][0]).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalled();
      }
    });
  });

  it('Does not kick member on role removal', async () => {
    const guild = new Guild({ channels: getChannels() });
    const oldMemberState = createMemberMock(guild, ROLE_ID);
    const newMemberState = createMemberMock(guild);
    await SpamKickingService.handleRoleUpdateEvent(
      oldMemberState,
      newMemberState,
    );
    expect(newMemberState.send).not.toHaveBeenCalled();
    expect(newMemberState.kick).not.toHaveBeenCalled();
    newMemberState.guild.channels.cache.forEach((channel) => {
      expect(channel.send).not.toHaveBeenCalled();
    });
  });

  it('Does not kick member on different role gains', async () => {
    const guild = new Guild({ channels: getChannels() });
    oldMemberState = createMemberMock(guild);
    // By not giving role ID, we effectively test that it does not exist
    newMemberState = createMemberMock(guild);
    await SpamKickingService.handleRoleUpdateEvent(
      oldMemberState,
      newMemberState,
    );
    expect(newMemberState.kick).not.toHaveBeenCalled();
    expect(newMemberState.send).not.toHaveBeenCalled();
    newMemberState.guild.channels.cache.forEach((channel) => {
      expect(channel.send).not.toHaveBeenCalled();
    });
  });

  it("Error is handled if channel doesn't exist", async () => {
    console.error = jest.fn();
    const channels = [new TextChannel('1234')];
    const guild = new Guild({ channels });
    oldMemberState = createMemberMock(guild);
    newMemberState = createMemberMock(guild, ROLE_ID);

    await SpamKickingService.handleRoleUpdateEvent(
      oldMemberState,
      newMemberState,
    );

    expect(console.error).toHaveBeenCalledTimes(1);
    console.error.mockClear();
  });
});
