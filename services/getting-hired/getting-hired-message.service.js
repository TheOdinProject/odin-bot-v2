const db = require('../../db');
const { RESTJSONErrorCodes } = require('discord-api-types/v9');

class GettingHiredMessageService {
  static #internalToken = Symbol();
  static instance = null;

  constructor(token) {
    // we want the cache to initialise populated with DB data, but that's async
    // constructors/static initialisation blocks can only be sync
    if (token !== GettingHiredMessageService.#internalToken) {
      throw new Error(
        'Please instantiate using `await GettingHiredMessageService.new()`!',
      );
    }

    this.cache = new Set();
  }

  async handleMessage(message) {
    const userId = message.member.id;

    try {
      if (this.cache.has(userId)) {
        return;
      }

      this.cache.add(userId);

      const userInDatabase = await this.isUserInDatabase(userId);
      if (!userInDatabase) {
        await Promise.all([
          this.addUserToDatabase(userId),
          GettingHiredMessageService.sendIntroMessage(message),
        ]);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async isUserInDatabase(userId) {
    return db.query(
      `
        SELECT EXISTS (
          SELECT 1 FROM getting_hired_participants
          WHERE discord_id = $1
        );
      `,
      [userId],
    );
  }

  async addUserToDatabase(userId) {
    await db.query(
      `
        INSERT INTO getting_hired_participants
        VALUES ($1);
      `,
      [userId],
    );
  }

  async populateCache() {
    const { rows } = await db.query(
      `SELECT * FROM getting_hired_participants;`,
    );
    this.cache = new Set([...this.cache, ...rows]);
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

  // Need a singleton but need its cache to initialise populated with DB data
  static async new() {
    if (GettingHiredMessageService.instance) {
      return GettingHiredMessageService.instance;
    }

    const instance = new GettingHiredMessageService(
      GettingHiredMessageService.#internalToken,
    );
    await instance.populateCache();
    GettingHiredMessageService.instance = instance;

    return instance;
  }
}

module.exports = GettingHiredMessageService;
