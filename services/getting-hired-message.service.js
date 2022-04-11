const Redis = require('ioredis');

class GettingHiredMessageService {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async handleMessage(message) {
    const userId = message.member.id;

    try {
      const userIsCached = await this.#isCached(userId);

      if (!userIsCached) {
        await this.redis.set(userId, true);
        await GettingHiredMessageService.sendAuthorMessage(message);
      } else {
        // TODO: (REMOVE block) toggle the user's existence in the cache for testing purposes.
        await this.redis.del(userId);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }

  static async sendAuthorMessage(message) {
    /* TODO: Construct the message embed to send to the user, either via DM or in the channel
    * If message cannot be DM'd it is sent in the channel. The message will need to mention or reply
    * to the user.
    */
    const welcomeMessage = 'Test message';

    try {
      await message.author.send(welcomeMessage);
    } catch (error) {
      if (error.name === 'DiscordAPIError') {
        await message.channel.send(welcomeMessage);
      } else {
        console.log(error);
      }
    }
  }

  async #isCached(userId) {
    const user = await this.redis.get(userId);
    if (user) return true;

    return false;
  }
}

module.exports = GettingHiredMessageService;
