class RedisConnectionError extends Error {
  constructor() {
    super(`
Could not start the bot. Has Redis been installed and have you enabled the service?

You can find your OS's installation instructions and Redis start command at https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/.
    `);
    this.name = 'RedisConnectionError';
  }
}

module.exports = RedisConnectionError;
