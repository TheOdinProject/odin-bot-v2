const {
  Client,
  Guild,
  GuildMember,
  TextChannel,
} = require('../../utils/mocks/discord');
const db = require('../../db');
const mockUsers = require('../../utils/mocks/database-users/awarding-points');

const selfAwardGif = 'http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif';

jest.mock('./club-40-gifs.json', () => [
  {
    gif: 'https://i.imgur.com/ofDEfYs.gif',
    author: 'Sully',
  },
]);

beforeEach(async () => {
  const initialDbState = [
    mockUsers.map((user) => user.id),
    mockUsers.map((user) => user.points),
  ];
  await db.query('TRUNCATE points;');
  await db.query(
    `INSERT INTO points SELECT * FROM unnest($1::text[], $2::integer[]);`,
    initialDbState,
  );
  jest.clearAllMocks();
});

afterAll(async () => {
  await db.end();
});
