const { execSync } = require('node:child_process');

class DatabaseError extends Error {
  constructor() {
    super(
      'There are migrations pending. Please run `npm run migrate` to apply these migrations.',
    );
    this.name = 'DatabaseError';
  }

  static hasPendingMigrations() {
    try {
      execSync('npm run migrate:status');
      return false;
    } catch {
      return true;
    }
  }
}

module.exports = DatabaseError;
