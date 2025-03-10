class RedisConnectionError extends Error {
  constructor() {
    super(`
Could not start Odin Bot locally. Has Redis been installed and have you started/enabled the service?

You can find your OS's Redis installation instructions and service start command at: https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/.
    `);
    this.name = 'RedisConnectionError';
  }
}

module.exports = RedisConnectionError;
