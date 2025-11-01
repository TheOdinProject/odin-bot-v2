class MissingEnvVarError extends Error {
  static #mandatoryEnvKeys = [
    'DISCORD_API_KEY',
    'DISCORD_CLIENT_ID',
    'DISCORD_GUILD_ID',
  ];

  constructor(missingEnvVars) {
    super(`
Could not start Odin Bot locally. The following value(s) are missing from your local .env file:

${missingEnvVars.join('\n')}

Follow the Odin Bot "Getting Started" guide for instructions on how to obtain and set these values: https://github.com/TheOdinProject/odin-bot-v2/wiki/Getting-Started.
    `);
    this.name = 'MissingEnvVarError';
  }

  static getMissingMandatoryKeys() {
    return MissingEnvVarError.#mandatoryEnvKeys.filter(
      (key) => !process.env[key],
    );
  }
}

module.exports = MissingEnvVarError;
