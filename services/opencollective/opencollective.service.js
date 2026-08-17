const { MessageFlags } = require('discord.js');
const config = require('../../config');
const db = require('../../db');

class OpenCollectiveService {
  static #API_URL = 'https://api.opencollective.com/graphql/v2';
  static #replies = {
    success: 'You have been given the Backer role, thanks for contributing!',
    failure: `Oops! Something went wrong so try again. If it keeps failing, contact us through <@${config.modmailUserId}> with a link to your Open Collective profile (\`https://opencollective.com/YOURUSERNAME\`) so we can verify and assign the role manually.`,
    alreadyBacker: 'You already have the Backer role!',
  };

  static async handleInteraction(interaction) {
    if (interaction.member.roles.cache.has(config.roles.backer)) {
      return interaction.reply({
        content: OpenCollectiveService.#replies.alreadyBacker,
        flags: MessageFlags.Ephemeral,
      });
    }

    const openCollectiveUsername = interaction.options.getString('username');

    const { data, errors } =
      await OpenCollectiveService.#fetchUserOpenCollectiveAccount(
        openCollectiveUsername,
      );
    if (errors) {
      return interaction.reply({
        content: OpenCollectiveService.#replies.failure,
        flags: MessageFlags.Ephemeral,
      });
    }

    const userBacksTOP = data.account.memberOf.nodes.find(
      ({ account }) => account.slug === 'theodinproject',
    );
    if (!userBacksTOP) {
      return interaction.reply({
        content: OpenCollectiveService.#replies.failure,
        flags: MessageFlags.Ephemeral,
      });
    }

    const isNewBacker = await this.#storeOpenCollectiveUsername(
      openCollectiveUsername,
    );

    if (isNewBacker) {
      await interaction.member.roles.add(config.roles.backer);
      interaction.reply({
        content: OpenCollectiveService.#replies.success,
        flags: MessageFlags.Ephemeral,
      });
    } else {
      // Username in db but no backer role
      // could mean new Discord account/left server and rejoined
      // but also anyone can use the command with any Open Collective username (even if not theirs).
      // So if username already in db, requires manual verification.
      interaction.reply({
        content: OpenCollectiveService.#replies.alreadyBacker,
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  static async #storeOpenCollectiveUsername(username) {
    const { rows } = await db.query(
      `
        INSERT INTO verified_opencollective_usernames
        VALUES ($1)
        ON CONFLICT DO NOTHING
        RETURNING username;
      `,
      [username],
    );

    const isNewBacker = rows.length > 0;
    return isNewBacker;
  }

  static async #fetchUserOpenCollectiveAccount(username) {
    const query = `query account($slug: String) {
      account(slug: $slug) {
        name
        slug
        memberOf(role: BACKER) {
          nodes {
            account {
              name
              slug
            }
          }
        }
      }
    }`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          slug: username,
        },
      }),
    };

    const result = await fetch(OpenCollectiveService.#API_URL, options);
    const data = await result.json();

    return data;
  }
}

module.exports = OpenCollectiveService;
