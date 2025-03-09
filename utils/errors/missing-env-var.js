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

module.exports = MissingEnvVarError;
