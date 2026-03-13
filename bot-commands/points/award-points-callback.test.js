const { MongoMemoryServer } = require('mongodb-memory-server');
const {
  Client,
  Guild,
  GuildMember,
  TextChannel,
  ODIN_BOT,
} = require('../../utils/mocks/discord');
const mockUsers = require('../../utils/mocks/database-users/awarding-points.js');

let awardPoints;
let database;
let PointsService;
const IDs = {
  generalChannel: '505093832157691916',
  club40Channel: '707225752608964628',
  noPointsChannel: '513125912070455296',
  club40Role: '707225790546444288',
};

jest.mock('./club-40-gifs.json', () => [
  {
    gif: 'https://i.imgur.com/ofDEfYs.gif',
    author: 'Sully',
  },
]);

beforeAll(async () => {
  database = await MongoMemoryServer.create();

  // must not hoist mock/require - both depend on MongoMemoryServer db URI
  jest.doMock('../../config.js', () => {
    const actual = jest.requireActual('../../config.js');
    actual.channels.noPointsChannelIds = [IDs.noPointsChannel];
    actual.channels.club40ChannelId = IDs.club40Channel;
    actual.roles.club40Id = IDs.club40Role;
    actual.databaseURI = database.getUri();
    return actual;
  });
  awardPoints = require('./award-points-mongo');
  PointsService = require('../../services/points/points-mongo.service.js');

  await PointsService.users.insertMany(mockUsers);
});

afterEach(async () => {
  jest.clearAllMocks();
  await PointsService.users.deleteMany();
  await PointsService.users.insertMany(mockUsers);
});

afterAll(async () => {
  await database.stop();
  await PointsService.client.close();
});
