const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  connectionString: config.databaseUrl,
  // as per https://devcenter.heroku.com/articles/connecting-heroku-postgres#connecting-in-node-js
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
