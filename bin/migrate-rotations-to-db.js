// Execute this script in the production console
// Then verify data, then PR removal of this script

const db = require('../db');
const RedisService = require('../services/redis');

(async () => {
  try {
    RedisService.init();
    const redis = RedisService.getInstance();

    const rotations = {
      triage: await redis.lrange('maintainerTriageRotationList', 0, -1),
      email: await redis.lrange('emailRotationList', 0, -1),
    };

    redis.end();

    const { rows } = await db.query(
      `
        UPDATE rotations
        SET queue = CASE
            WHEN name = 'triage' THEN $1::text[]
            WHEN name = 'email' THEN $2::text[]
          END
        RETURNING *;
      `,
      [rotations.triage, rotations.email],
    );
    for (const row of rows) {
      console.log(`\nAdded ${row.name} rotation:`);
      console.log(`[${row.queue}]`);
      console.log(
        `${row.queue.toString() === rotations[row.name].toString() ? 'All matches!' : 'Queue mismatch!'}`,
      );
    }
    await db.end();
  } catch (error) {
    console.error('Something went wrong migrating the users!');
    console.error(error);
  }
})();
