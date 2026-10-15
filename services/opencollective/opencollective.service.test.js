const { MessageFlags } = require('discord.js');
const OpenCollectiveService = require('./opencollective.service');
const db = require('../../db');
const config = require('../../config');
const {
  nonBacker,
  backerWithRole,
  backerWithoutRole,
} = require('../../test/mocks/database-users/opencollective');

const replies = {
  success: 'You have been given the Backer role, thanks for contributing!',
  failure: `Oops! Something went wrong so try again. If it keeps failing, contact us through <@${config.modmailUserId}> (instructions in <#${config.channels.contactModeratorsChannelId}>) with a link to your Open Collective profile (\`https://opencollective.com/YOURUSERNAME\`) so we can verify and assign the role manually.`,
  alreadyBacker: 'You already have the Backer role!',
};

const fetchSpy = jest.spyOn(globalThis, 'fetch');

function createInteraction({ member, opencollectiveUsername }) {
  return {
    member,
    options: {
      getString: () => opencollectiveUsername,
    },
    reply: jest.fn((message) => message).mockName('Bot reply'),
  };
}

function createOpenCollectiveResponse({ data, hasError }) {
  return {
    json: async () => ({
      data,
      errors: hasError ? new Error() : null,
    }),
  };
}

beforeEach(async () => {
  await db.query('TRUNCATE verified_opencollective_usernames;');
  await db.query(
    `
      INSERT INTO verified_opencollective_usernames
      VALUES ($1);
    `,
    [backerWithRole.opencollectiveUsername],
  );

  jest.clearAllMocks();
});

afterAll(async () => {
  await db.end();
});

describe('Member already has the backer role', () => {
  const interaction = createInteraction(backerWithRole);

  it('replies with existing backer message', async () => {
    await OpenCollectiveService.handleInteraction(interaction);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: replies.alreadyBacker,
      flags: MessageFlags.Ephemeral,
    });
  });

  it('does not duplicate username in database', async () => {
    const query = 'SELECT * FROM verified_opencollective_usernames;';
    const preInteraction = await db.query(query);
    await OpenCollectiveService.handleInteraction(interaction);
    const postInteraction = await db.query(query);

    expect(postInteraction.rows).toEqual(preInteraction.rows);
  });
});

describe('Member does not have the backer role', () => {
  describe('No Open Collective account associated with provided username', () => {
    beforeEach(() => {
      fetchSpy.mockResolvedValue(
        createOpenCollectiveResponse({ hasError: true }),
      );
    });

    const interaction = createInteraction(nonBacker);

    it('replies with failure message', async () => {
      await OpenCollectiveService.handleInteraction(interaction);
      expect(interaction.reply).toHaveBeenCalledWith({
        content: replies.failure,
        flags: MessageFlags.Ephemeral,
      });
    });

    it('does not insert username into database', async () => {
      const query = 'SELECT * FROM verified_opencollective_usernames;';
      const preInteraction = await db.query(query);
      await OpenCollectiveService.handleInteraction(interaction);
      const postInteraction = await db.query(query);

      expect(postInteraction.rows).toEqual(preInteraction.rows);
    });
  });

  describe('Open Collective account does not back TOP', () => {
    beforeEach(() => {
      fetchSpy.mockResolvedValue(
        createOpenCollectiveResponse({
          data: { account: { memberOf: { nodes: [] } } },
        }),
      );
    });

    const interaction = createInteraction(nonBacker);

    it('replies with failure message', async () => {
      await OpenCollectiveService.handleInteraction(interaction);
      expect(interaction.reply).toHaveBeenCalledWith({
        content: replies.failure,
        flags: MessageFlags.Ephemeral,
      });
    });

    it('does not insert username into database', async () => {
      await OpenCollectiveService.handleInteraction(interaction);
      const { rows } = await db.query(
        'SELECT * FROM verified_opencollective_usernames WHERE username = $1;',
        [nonBacker.opencollectiveUsername],
      );

      expect(rows).toHaveLength(0);
    });
  });

  describe('Open Collective account backs TOP', () => {
    beforeEach(() => {
      fetchSpy.mockResolvedValue(
        createOpenCollectiveResponse({
          data: {
            account: {
              memberOf: { nodes: [{ account: { slug: 'theodinproject' } }] },
            },
          },
        }),
      );
    });

    it('replies with success message when member is a new backer', async () => {
      const interaction = createInteraction(nonBacker);
      await OpenCollectiveService.handleInteraction(interaction);
      expect(interaction.reply).toHaveBeenCalledWith({
        content: replies.success,
        flags: MessageFlags.Ephemeral,
      });
    });

    it("inserts new backer's username into database", async () => {
      const interaction = createInteraction(nonBacker);
      await OpenCollectiveService.handleInteraction(interaction);
      const { rows } = await db.query(
        'SELECT * FROM verified_opencollective_usernames WHERE username = $1;',
        [nonBacker.opencollectiveUsername],
      );

      expect(rows[0].username).toBe('member');
    });

    it('replies with existing backer message when username already in database', async () => {
      const interaction = createInteraction(backerWithoutRole);
      await OpenCollectiveService.handleInteraction(interaction);
      expect(interaction.reply).toHaveBeenCalledWith({
        content: replies.alreadyBacker,
        flags: MessageFlags.Ephemeral,
      });
    });

    it('does not duplicate existing username in database', async () => {
      const interaction = createInteraction(backerWithoutRole);
      const query = 'SELECT * FROM verified_opencollective_usernames;';
      const preInteraction = await db.query(query);
      await OpenCollectiveService.handleInteraction(interaction);
      const postInteraction = await db.query(query);

      expect(postInteraction.rows).toEqual(preInteraction.rows);
    });
  });
});
