/**
 * This script can be run to delete requested user data from the database.
 * Currently, the valid options are:
 *
 * --discordId=<string>
 *
 * For example, to delete all data for the user 12345, run:
 *
 * node bin/delete-user-data.js --discordId=12345
 */

const { parseArgs } = require('node:util');
const db = require('../db');

const cliArgs = parseArgs({
  options: {
    discordId: { type: 'string' },
  },
}).values;

if (Object.entries(cliArgs).length === 0) {
  console.error(
    'Please provide a Discord user ID to be deleted from the database.',
  );
  return;
}

(async () => {
  const { discordId } = cliArgs;

  // Must use single client instead of pool for transactions: https://node-postgres.com/features/transactions
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Data deletion queries go here
    await client.query('DELETE FROM points WHERE discord_id = $1', [discordId]);

    await client.query('COMMIT');
    console.log('Transaction completed: User data successfully deleted.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await db.end();
  }
})();
