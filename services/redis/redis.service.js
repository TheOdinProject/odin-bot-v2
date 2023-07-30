const Redis = require('ioredis');

class RedisService {
  static #instance;

  static init() {
    if (RedisService.#instance) {
      throw new Error('RedisService is already initialized');
    }

    RedisService.#instance = new Redis(process.env.REDIS_URL);
  }

  static getInstance() {
    if (!RedisService.#instance) {
      throw new Error('RedisService is not initialized');
    }

    return RedisService.#instance;
  }
}

module.exports = RedisService;
