const db = require('../db');
const { RESTJSONErrorCodes } = require('discord-api-types/v9');

class GettingHiredMessageService {
  constructor() {
    this.cache = new Set();
    this.populateCache(); // in-memory cache empty on start-up e.g. new deploy
  }

  async handleMessage(message, isAdminMessage) {
    if (isAdminMessage) return;

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
}

module.exports = GettingHiredMessageService;
