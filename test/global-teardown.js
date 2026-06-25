const db = require('../db');

module.exports = async () => {
  // ensure no test run can interfere with the setup of a future test run
  await db.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
  `);
  await db.end();
};
