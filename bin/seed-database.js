const db = require('../db');
const RotationService = require('../services/rotations');

(async () => {
  console.log('Seeding database...');

  try {
    await db.query(
      `
        INSERT INTO rotations
        SELECT * FROM unnest($1::text[])
        ON CONFLICT (name) DO NOTHING;
      `,
      [RotationService.rotations],
    );
  } catch (error) {
    console.error('Failed to seed database with rotations:');
    throw error;
  }

  console.log('Database successfully seeded!');
})();
