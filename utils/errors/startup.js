class RedisConnectionError extends Error {
  constructor() {
    super(`
Could not start the bot. Has Redis been installed and have you enabled the service?

You can find your OS's installation instructions and Redis start command at https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/.
    `);
    this.name = 'RedisConnectionError';
  }
}

class MissingEnvVarError extends Error {
  constructor(missingEnvVars) {
    super(`
Could not start the bot. The following values are missing from .env:

${missingEnvVars.join('\n')}

Follow our "Getting Started" guide to obtain and set these values: https://github.com/TheOdinProject/odin-bot-v2/wiki/Getting-Started.
    `);
    this.name = 'MissingEnvVarError';
  }
}

module.exports = { RedisConnectionError, MissingEnvVarError };
