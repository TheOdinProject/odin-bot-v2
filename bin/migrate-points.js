// Execute this script in the production console
// Then verify data, then PR removal of this script

const db = require('../db');

(async () => {
  try {
    const response = await fetch('https://www.theodinproject.com/api/points', {
      headers: {
        Authorization: `Token ${process.env.POINTSBOT_TOKEN}`,
      },
    });
    const existingData = await response.json();

    const { rows } = await db.query(
      `
        INSERT INTO points
        SELECT * FROM unnest($1::text[], $2::integer[])
        RETURNING *;
      `,
      [
        existingData.map((row) => row.discord_id),
        existingData.map((row) => row.points),
      ],
    );
    console.log(
      `
      ${existingData.length} users in original DB
      ${rows.length} users inserted into new DB
      
      ${existingData.length === rows.length ? 'All good!' : 'Count mismatch!'}
      `,
    );
    await db.end();
  } catch (error) {
    console.error('Something went wrong migrating the users!');
    console.error(error);
  }
})();
