const SpamBanningService = require('./spam-banning.service');
const {
  Role,
  GuildMember,
  Message,
  Guild,
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

function createInteractionMock(message, guild) {
  let replyArg;
  let messageComponentReturn;

  return {
    setMessageComponentReturn: (arg) => {
      messageComponentReturn = arg;
    },
    reply: jest.fn((arg) => {
      replyArg = arg;
      return {
        resource: {
          message: {
            awaitMessageComponent: () => {
              if (messageComponentReturn === 'timeout') {
                return Promise.reject();
              }
              return Promise.resolve({
                customId: messageComponentReturn,
                deferUpdate: () => {},
              });
            },
          },
        },
      };
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
    editReply: jest.fn(),
  };
}

function createMessageMock() {
  const member = new GuildMember({ id: '123', username: 'bad.spammer' });
  return new Message({
    channelId: config.channels.automodBlock.id,
    author: member.user,
    member,
  });
}

describe('Banning spammer in automod channel', () => {
  let interactionMock;
  beforeEach(() => {
    const messageMock = createMessageMock();
    const guildMock = new Guild();
    interactionMock = createInteractionMock(messageMock, guildMock);
  });

  it('Ban user if in the automod channel', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.guild.members.ban).toHaveBeenCalledTimes(1);
    expect(
      interactionMock.guild.members.ban.mock.calls[0][1],
    ).toMatchSnapshot();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });
});

describe('Banning spammer in other channels', () => {
  let interactionMock;
  beforeEach(() => {
    const messageMock = createMessageMock();
    messageMock.channelId = '123';
    const guildMock = new Guild();
    interactionMock = createInteractionMock(messageMock, guildMock);
  });

  it('Asks for confirmation if not in automod channel', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.reply).toHaveBeenCalledTimes(1);
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });

  it('Bans user and deletes their messages if delete message button clicked', async () => {
    interactionMock.setMessageComponentReturn('deleteMessages');
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.guild.members.ban).toHaveBeenCalledTimes(1);
    expect(
      interactionMock.guild.members.ban.mock.calls[0][1],
    ).toMatchSnapshot();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });

  it('Bans user and does not delete their messages if keep message button clicked', async () => {
    interactionMock.setMessageComponentReturn('keepMessages');
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.guild.members.ban).toHaveBeenCalledTimes(1);
    expect(
      interactionMock.guild.members.ban.mock.calls[0][1],
    ).toMatchSnapshot();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });

  it('Still deletes the message that triggered the interaction', async () => {
    interactionMock.setMessageComponentReturn('keepMessages');
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.delete).toHaveBeenCalledTimes(1);
  });

  it('Cancels the action if the cancel button is clicked', async () => {
    interactionMock.setMessageComponentReturn('cancel');
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.editReply).toHaveBeenCalledTimes(1);
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
    expect(interactionMock.message.delete).not.toHaveBeenCalled();
    expect(interactionMock.guild.members.ban).not.toHaveBeenCalled();
  });

  it('Cancels the action if the response times out', async () => {
    interactionMock.setMessageComponentReturn('timeout');
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.editReply).toHaveBeenCalledTimes(1);
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
    expect(interactionMock.message.delete).not.toHaveBeenCalled();
    expect(interactionMock.guild.members.ban).not.toHaveBeenCalled();
  });
});

describe('Banning spammer with DM enabled', () => {
  let interactionMock;
  beforeEach(() => {
    const messageMock = createMessageMock();
    const guildMock = new Guild();
    interactionMock = createInteractionMock(messageMock, guildMock);
  });

  it('Discord ban api is called with the correct reason', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.guild.members.ban).toHaveBeenCalledTimes(1);
    expect(
      interactionMock.guild.members.ban.mock.calls[0][1],
    ).toMatchSnapshot();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });

  it('Discord message api is called with the correct message', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.author.send).toHaveBeenCalledTimes(1);
    expect(
      interactionMock.message.author.send.mock.calls[0][0],
    ).toMatchSnapshot();
  });

  it('Reacts with the correct emoji', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.react).toHaveBeenCalledTimes(1);
    expect(interactionMock.message.react.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Sends log to the correct channel', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    interactionMock.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLog.id) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.send.mock.calls[0][0]).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalled();
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
    const guildMock = new Guild();
    messageMock.author.send = jest.fn(() => {
      throw new Error("Can't contact user");
    });
    interactionMock = createInteractionMock(messageMock, guildMock);
  });

  it('Discord ban api is called with the correct reason', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.guild.members.ban).toHaveBeenCalledTimes(1);
    expect(
      interactionMock.guild.members.ban.mock.calls[0][1],
    ).toMatchSnapshot();
  });

  it('Discord message api is called and error handled', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.author.send).toHaveBeenCalledTimes(1);
  });

  it('Reacts with the correct emoji', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.message.react).toHaveBeenCalledTimes(1);
    expect(interactionMock.message.react.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Sends log to the correct channel', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    interactionMock.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLog.id) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.send.mock.calls[0][0]).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalled();
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
    const guildMock = new Guild();
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
    expect(interactionMock.message.react.mock.calls[0][0]).toMatchSnapshot();
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
    const guildMock = new Guild();
    interactionMock = createInteractionMock(messageMock, guildMock);
  });

  it('Does not ban bots', async () => {
    interactionMock.message.author.bot = true;
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.guild.members.ban).not.toHaveBeenCalled();
    expect(interactionMock.message.author.send).not.toHaveBeenCalled();
    expect(interactionMock.message.react).not.toHaveBeenCalled();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });

  it('Does not ban moderators', async () => {
    interactionMock.message.member.roles.add(Role.moderator);
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.guild.members.ban).not.toHaveBeenCalled();
    expect(interactionMock.message.author.send).not.toHaveBeenCalled();
    expect(interactionMock.message.react).not.toHaveBeenCalled();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });

  it('Does not ban maintainers', async () => {
    interactionMock.message.member.roles.add(Role.maintainer);
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.guild.members.ban).not.toHaveBeenCalled();
    expect(interactionMock.message.author.send).not.toHaveBeenCalled();
    expect(interactionMock.message.react).not.toHaveBeenCalled();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });

  it('Does not ban core', async () => {
    interactionMock.message.member.roles.add(Role.core);
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.guild.members.ban).not.toHaveBeenCalled();
    expect(interactionMock.message.author.send).not.toHaveBeenCalled();
    expect(interactionMock.message.react).not.toHaveBeenCalled();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });

  it('Does not ban admins', async () => {
    interactionMock.message.member.roles.add(Role.admin);
    await SpamBanningService.handleInteraction(interactionMock);
    expect(interactionMock.guild.members.ban).not.toHaveBeenCalled();
    expect(interactionMock.message.author.send).not.toHaveBeenCalled();
    expect(interactionMock.message.react).not.toHaveBeenCalled();
    expect(interactionMock.getReplyArg()).toMatchSnapshot();
  });
});

describe('Attempting to log banned user in moderation log channel', () => {
  let interactionMock;
  beforeEach(() => {
    const messageMock = createMessageMock();
    const guildMock = new Guild();
    interactionMock = createInteractionMock(messageMock, guildMock);
  });

  it('Sends log to the correct channel', async () => {
    await SpamBanningService.handleInteraction(interactionMock);
    interactionMock.guild.channels.cache.forEach((channel) => {
      if (channel.id === config.channels.moderationLog.id) {
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.send.mock.calls[0][0]).toMatchSnapshot();
      } else {
        expect(channel.send).not.toHaveBeenCalled();
      }
    });
  });

  it("Error is handled if channel doesn't exist", async () => {
    console.error = jest.fn();
    interactionMock.guild.channels.delete(config.channels.moderationLog.id);
    await SpamBanningService.handleInteraction(interactionMock);
    interactionMock.guild.channels.cache.forEach((channel) => {
      expect(channel.send).not.toHaveBeenCalled();
    });
    expect(console.error).toHaveBeenCalledTimes(1);
    console.error.mockClear();
  });
});
