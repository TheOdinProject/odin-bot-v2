const db = require('../db');

module.exports = async ({ watch, watchAll }) => {
  // Ensure no test run can interfere with the setup of a future test run
  await db.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
  `);

  // Pool instance shared between watch-mode runs, so ending it in teardown interferes with reruns.
  // In watch mode, you manually interrupt the process anyway
  // so calling `.end()` only necessary in non-watch test runs where Jest is what exits the process
  const isWatchMode = watch || watchAll;
  if (!isWatchMode) {
    await db.end();
  }
};
