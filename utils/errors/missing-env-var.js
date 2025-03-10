class MissingEnvVarError extends Error {
  constructor(missingEnvVars) {
    super(`
Could not start Odin Bot locally. The following value(s) are missing from your local .env file:

${missingEnvVars.join('\n')}

Follow the Odin Bot "Getting Started" guide for instructions on how to obtain and set these values: https://github.com/TheOdinProject/odin-bot-v2/wiki/Getting-Started.
    `);
    this.name = 'MissingEnvVarError';
  }
}

module.exports = MissingEnvVarError;
