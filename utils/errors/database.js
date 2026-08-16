const { execSync } = require('node:child_process');

class DatabaseError extends Error {
  static #databaseEnvVar =
    process.env.NODE_ENV === 'test' ? 'TEST_DATABASE_URL' : 'DATABASE_URL';
  static #codes = {
    pendingMigrations: 1,
    connectionError: 2,
  };
  static #messages = new Map()
    .set(
      DatabaseError.#codes.pendingMigrations,
      'There are migrations pending. Please run `npm run migrate` to apply these migrations.',
    )
    .set(
      DatabaseError.#codes.connectionError,
      `
Unable to connect to the database.
Is the ${DatabaseError.#databaseEnvVar} connection string correct?
Have you made sure to enable and start the PostgreSQL service on your system?
      `,
    );

  constructor(errorCode) {
    const message =
      DatabaseError.#messages.get(errorCode) ??
      `Unknown error code ${errorCode} when trying to connect to the database. Please file a bug report: https://github.com/TheOdinProject/odin-bot-v2/issues/new?template=bug_report.yaml`;

    super(message);
    this.name = 'DatabaseError';
  }

  static get codes() {
    return DatabaseError.#codes;
  }

  static checkMigrations() {
    try {
      execSync(
        `npx dbmate --env=${DatabaseError.#databaseEnvVar} status --exit-code`,
      );
      return 0;
    } catch (error) {
      return error.status;
    }
  }
}

module.exports = DatabaseError;
