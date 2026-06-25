const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  connectionString: config.databaseUrl,
  onConnect: async (client) => {
    await client.query(`
      CREATE TABLE IF NOT EXISTS points (
        discord_id   text PRIMARY KEY,
        points       integer NOT NULL
      );
    `);
  },
});

module.exports = pool;
