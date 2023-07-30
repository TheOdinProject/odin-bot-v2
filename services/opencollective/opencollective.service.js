const config = require('../../config');
const RedisService = require('../redis');

class OpenCollectiveService {
  static API_URL = 'https://api.opencollective.com/graphql/v2';

  static successMessage = 'You have been given the Backer role, thanks for contributing!';

  static errorMessage = `Oops, something went wrong. Contact us through <@${config.modmailUserId}> so we can assign the role manually.`;

  static ourOpenCollectiveUsername = 'theodinproject';

  static redisKeyForVerifiedOpenCollectiveUsernames = 'verified_oc_usernames';

  static async handleInteraction(interaction) {
    const username = interaction.options.getString('username');
    const redis = RedisService.getInstance();

    if (
      await OpenCollectiveService.isUsernameCached(username, redis)
    ) {
      return interaction.reply({
        content: OpenCollectiveService.errorMessage,
        ephemeral: true,
      });
    }

    const data = await OpenCollectiveService.fetchUserOpenCollectiveAccount(username);

    if (data.errors) {
      return interaction.reply({
        content: OpenCollectiveService.errorMessage,
        ephemeral: true,
      });
    }

    const userAccount = data.data.account;

    if (OpenCollectiveService.isUserOpenCollectiveMember(userAccount)) {
      await redis.lpush(
        OpenCollectiveService.redisKeyForVerifiedOpenCollectiveUsernames,
        username,
      );
      await interaction.member.roles.add(config.roles.backer);
      return interaction.reply({
        content: OpenCollectiveService.successMessage,
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: OpenCollectiveService.errorMessage,
      ephemeral: true,
    });
  }

  static isUserOpenCollectiveMember(userAccount) {
    return userAccount.memberOf.nodes.find(
      (node) => node.account.slug === OpenCollectiveService.ourOpenCollectiveUsername,
    );
  }

  static async isUsernameCached(username, redis) {
    const index = await redis.lpos(
      OpenCollectiveService.redisKeyForVerifiedOpenCollectiveUsernames,
      username,
    );
    return index !== null;
  }

  static async fetchUserOpenCollectiveAccount(username) {
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

    const result = await fetch(
      OpenCollectiveService.API_URL,
      options,
    );
    const data = await result.json();

    return data;
  }
}

module.exports = OpenCollectiveService;
