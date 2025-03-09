const Redis = require('ioredis');
const { exitProcessNoRedis } = require('../../utils/errors/startup');

class RedisService {
  static #instance;

  static init() {
    if (RedisService.#instance) {
      throw new Error('RedisService is already initialized');
    }

    RedisService.#instance = new Redis(process.env.REDIS_URL);
    RedisService.#instance.on('connect', () =>
      console.log('Successfully connected to Redis.'),
    );
    RedisService.#instance.on('error', exitProcessNoRedis);
  }

  static getInstance() {
    if (!RedisService.#instance) {
      throw new Error('RedisService is not initialized');
    }

    return RedisService.#instance;
  }
}

module.exports = RedisService;
