// Execute this script in the production console
// Then verify data, then PR removal of this script

const { MongoClient } = require('mongodb');

(async () => {
  try {
    const response = await fetch('https://www.theodinproject.com/api/points', {
      headers: {
        Authorization: `Token ${process.env.POINTSBOT_TOKEN}`,
      },
    });
    const data = await response.json();

    const client = new MongoClient(process.env.DATABASE_URI);
    const usersCollection = client.db().collection('users');

    const dataToInsert = data.map(({ discord_id, points }) => ({
      discordID: discord_id,
      points,
    }));

    const { insertedCount } = await usersCollection.insertMany(dataToInsert);
    console.log(
      `${insertedCount} users migrated out of ${data.length} - ${insertedCount === data.length ? 'all good' : 'count mismatch'}`,
    );

    client.close();
  } catch (error) {
    console.error('Something went wrong migrating the users!');
    console.error(error);
  }
})();
