const db = require('../../db');
const { RESTJSONErrorCodes } = require('discord.js');

class GettingHiredMessageService {
  static cache = new Set();

  static {
    // Doesn't need to be awaited because handleMessage will do a separate DB check
    GettingHiredMessageService.#populateCache();
  }

  static async handleMessage(message) {
    const userId = message.member.id;

    try {
      if (GettingHiredMessageService.cache.has(userId)) {
        return;
      }

      GettingHiredMessageService.cache.add(userId);

      const userInDatabase =
        await GettingHiredMessageService.#isUserInDatabase(userId);
      if (!userInDatabase) {
        await Promise.all([
          GettingHiredMessageService.#addUserToDatabase(userId),
          GettingHiredMessageService.#sendIntroMessage(message),
        ]);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }

  static async #isUserInDatabase(userId) {
    const { rows } = await db.query(
      `
        SELECT EXISTS (
          SELECT 1 FROM getting_hired_participants
          WHERE discord_id = $1
        );
      `,
      [userId],
    );
    return rows[0].exists;
  }

  static async #addUserToDatabase(userId) {
    await db.query('INSERT INTO getting_hired_participants VALUES ($1);', [
      userId,
    ]);
  }

  static async #populateCache() {
    const { rows } = await db.query(
      'SELECT discord_id FROM getting_hired_participants;',
    );

    const discordIds = rows.map((row) => row.discord_id);
    GettingHiredMessageService.cache = new Set([
      ...GettingHiredMessageService.cache,
      ...discordIds,
    ]);
  }

  static async #sendIntroMessage(message) {
    const welcomeMessage =
      'Welcome to the channel for the **Getting Hired** part of the curriculum. Please ensure you have **completed the Getting Hired course** and **read all of the pins** prior to engaging in this channel for resume review, interview help, or anything else covered in that section!';

    try {
      await message.member.send(welcomeMessage);
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
