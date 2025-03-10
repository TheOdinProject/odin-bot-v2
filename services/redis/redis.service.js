const Redis = require('ioredis');
const RedisConnectionError = require('../../utils/errors/redis-not-found');

class RedisService {
  static #instance;

  static init() {
    if (RedisService.#instance) {
      throw new Error('RedisService is already initialized');
    }

    RedisService.#instance = new Redis(process.env.REDIS_URL);
    RedisService.#instance.on('connect', () =>
      console.log(
        `Successfully connected to Redis at: ${process.env.REDIS_URL}`,
      ),
    );
    RedisService.#instance.on('error', () => {
      throw new RedisConnectionError();
    });
  }

  static getInstance() {
    if (!RedisService.#instance) {
      throw new Error('RedisService is not initialized');
    }

    return RedisService.#instance;
  }
}

module.exports = RedisService;
