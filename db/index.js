const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  connectionString: config.databaseUri,
  onConnect: async (client) => {
    await client.query(`
      CREATE TABLE IF NOT EXISTS points (
        discord_id   text UNIQUE NOT NULL,
        points       integer NOT NULL
      );
    `);
  },
});

module.exports = pool;
