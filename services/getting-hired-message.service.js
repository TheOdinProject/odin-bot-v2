const { RESTJSONErrorCodes } = require('discord-api-types/v9');
const RedisService = require('./redis');

class GettingHiredMessageService {
  constructor() {
    this.redis = RedisService.getInstance();
  }

  async handleMessage(message, isAdminMessage) {
    if (isAdminMessage) return;

    const userId = message.member.id;

    try {
      const userIsCached = false;

      if (!userIsCached) {
        await this.redis.set(userId, true);
        await GettingHiredMessageService.sendIntroMessage(message);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }

  static async sendIntroMessage(message) {
    const welcomeMessage =
      'Welcome to the channel for the **Getting Hired** part of the curriculum. Please ensure you have **completed the Getting Hired course** and **read all of the pins** prior to engaging in this channel for resume review, interview help, or anything else covered in that section!';

    try {
      await message.author.send(welcomeMessage);
    } catch (error) {
      if (error.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) {
        await message.reply(welcomeMessage);
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
