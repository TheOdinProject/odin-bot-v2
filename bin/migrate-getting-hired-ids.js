// Execute this script in the production console
// Then verify data, then PR removal of this script

const db = require('../db');
const RedisService = require('../services/redis');

(async () => {
  try {
    RedisService.init();
    const redis = RedisService.getInstance();
    const listKeys = [
      'maintainerTriageRotationList',
      'emailRotationList',
      'verified_oc_usernames',
    ];

    const keys = await redis.keys('*');
    const userIds = keys.filter((key) => !listKeys.includes(key));
    redis.end();

    const { rows } = await db.query(
      `
        INSERT INTO getting_hired_participants
        SELECT * FROM unnest($1::text[])
        RETURNING *;
      `,
      [userIds],
    );
    console.log(
      `
      ${userIds.length} users in Redis
      ${rows.length} users inserted into DB

      ${userIds.length === rows.length ? 'All good!' : 'Count mismatch!'}
      `,
    );
    await db.end();
  } catch (error) {
    console.error('Something went wrong migrating the users!');
    console.error(error);
  }
})();
