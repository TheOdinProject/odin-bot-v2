// Execute this script in the production console
// Then verify data, then PR removal of this script

const db = require('../db');
const RedisService = require('../services/redis');

(async () => {
  try {
    RedisService.init();
    const redis = RedisService.getInstance();
    const opencollectiveUsernames = await redis.lrange(
      'verified_oc_usernames',
      0,
      -1,
    );
    redis.end();

    const { rows } = await db.query(
      `
        INSERT INTO verified_opencollective_usernames
        SELECT * FROM unnest($1::text[])
        RETURNING *;
      `,
      [opencollectiveUsernames],
    );
    console.log(
      `
      ${opencollectiveUsernames.length} Open Collective usernames in Redis
      ${rows.length} users inserted into DB

      ${opencollectiveUsernames.length === rows.length ? 'All good!' : 'Count mismatch!'}
      `,
    );
    await db.end();
  } catch (error) {
    console.error('Something went wrong migrating the usernames!');
    console.error(error);
  }
})();
