const { Guild, GuildMember, TextChannel } = require('../../test/mocks/discord');
const GettingHiredMessageService = require('./getting-hired-message.service');
const config = require('../../config');
const db = require('../../db');
const { RESTJSONErrorCodes } = require('discord.js');

const participant = { id: 'participant', username: 'User participant' };

beforeEach(async () => {
  const initialDbState = [participant.id];
  await db.query('TRUNCATE getting_hired_participants;');
  await db.query(
    'INSERT INTO getting_hired_participants VALUES ($1);',
    initialDbState,
  );
  GettingHiredMessageService.cache = new Set(initialDbState);
  jest.clearAllMocks();
});

afterAll(async () => {
  await db.end();
});

describe('On sending message in Getting Hired channel', () => {
  const nonParticipantMember = new GuildMember({
    id: 'nonparticipant',
    username: 'User nonparticipant',
  });
  const participantMember = new GuildMember(participant);
  const gettingHiredChannel = new TextChannel(
    config.channels.gettingHiredChannelId,
  );

  function createMessage(author) {
    return {
      member: author,
      content: 'hello',
      channel: gettingHiredChannel,
      guild: new Guild({
        members: [participantMember, nonParticipantMember],
        channels: [gettingHiredChannel],
      }),
      reply: jest.fn(),
    };
  }

  it('Sends DM to author if they have not posted in the channel before', async () => {
    const author = nonParticipantMember;
    const message = createMessage(author);

    await GettingHiredMessageService.handleMessage(message);
    expect(author.send).toHaveBeenCalled();
    expect(message.reply).not.toHaveBeenCalled();
  });

  it('Posts to the channel if author has not posted in the channel before and does not accept DMs', async () => {
    const author = nonParticipantMember;
    const message = createMessage(author);

    author.send.mockImplementationOnce(() => {
      const dmDisabledError = new Error();
      dmDisabledError.code = RESTJSONErrorCodes.CannotSendMessagesToThisUser;
      throw dmDisabledError;
    });

    await GettingHiredMessageService.handleMessage(message);
    expect(message.reply).toHaveBeenCalled();
  });

  it('Caches author if they have not posted in the channel before', async () => {
    const author = nonParticipantMember;
    const message = createMessage(author);

    await GettingHiredMessageService.handleMessage(message);
    expect(GettingHiredMessageService.cache).toContain(author.id);
  });

  it('Adds author to database if they have not posted in the channel before', async () => {
    const author = nonParticipantMember;
    const message = createMessage(author);

    await GettingHiredMessageService.handleMessage(message);
    const result = await db.query(
      `
        SELECT EXISTS (
          SELECT 1 FROM getting_hired_participants
          WHERE discord_id = $1
        );
      `,
      [author.id],
    );
    expect(result.rows[0].exists).toBe(true);
  });

  it('Does not DM author if they have posted in the channel before', async () => {
    const author = participantMember;
    const message = createMessage(author);

    await GettingHiredMessageService.handleMessage(message);
    expect(author.send).not.toHaveBeenCalled();
  });

  it('Does not DM author if they are not cached but are in the database', async () => {
    const author = participantMember;
    const message = createMessage(author);
    GettingHiredMessageService.cache.delete(author.id);

    await GettingHiredMessageService.handleMessage(message);
    expect(author.send).not.toHaveBeenCalled();
  });

  it('Caches author if they are not cached but are in the database', async () => {
    const author = participantMember;
    const message = createMessage(author);
    GettingHiredMessageService.cache.delete(author.id);

    await GettingHiredMessageService.handleMessage(message);
    expect(GettingHiredMessageService.cache).toContain(author.id);
  });

  it('Does not cache author if the database op fails', async () => {
    jest.spyOn(db, 'query').mockImplementationOnce(async () => {
      throw new Error('oops!');
    });

    const author = nonParticipantMember;
    const message = createMessage(author);

    try {
      await GettingHiredMessageService.handleMessage(message);
    } catch {
      // error is handled outside of service
    } finally {
      expect(GettingHiredMessageService.cache).not.toContain(author.id);
    }
  });
});
