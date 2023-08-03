const leaderboard = require('../slash/leaderboard');
const getLeaderboardInformation = leaderboard.execute;


// const axios = require('axios');
// const commands = require('./leaderboard');
// const { generateLeaderData } = require('./mockData');
// /* eslint-disable */
// /* eslint max-classes-per-file: ["error", 2] */
//
//
// class GuildMembersMock {
//   members;
//
//   cache;
//
//   constructor(users) {
//     this.members = users;
//     this.cache = {
//       get: (id) => users.filter((member) => member.discord_id === id)[0],
//     };
//   }
// }
//
// class GuildMock {
//   members;
//
//   member;
//
//   constructor(users) {
//     this.members = new GuildMembersMock(users);
//     this.member = (user) => users.filter((member) => member === user)[0];
//   }
// }
//
// describe('!leaderboard', () => {
//   describe('regex', () => {
//     it.each([
//       ['!leaderboard'],
//       ['<@!123456789> !leaderboard'],
//       ['!leaderboard n=10 start=30'],
//       ['!leaderboard n=20 start=50'],
//       ['!leaderboard n=10'],
//       ['!leaderboard start=30'],
//     ])('correct strings trigger the callback', (string) => {
//       expect(commands.leaderboard.regex.test(string)).toBeTruthy();
//     });
//
//     it.each([
//       ['!leaderboad'],
//       [''],
//       [' '],
//       [' !'],
//       ['!lead'],
//       ['leaderboard'],
//       ['!le'],
//       ['!leaderboards'],
//       ['```function("!leaderboard", () => {}```'],
//       ['!leader'],
//       ['<@!123456789> ! leaderboard'],
//       ['<@!123456789> !leaderbard'],
//       ['!leaderbord n=10 start=30'],
//     ])("'%s' does not trigger the callback", (string) => {
//       expect(commands.leaderboard.regex.test(string)).toBeFalsy();
//     });
//
//     it.each([
//       ['Check this out! !leaderboard'],
//       ["Don't worry about !leaderboard"],
//       ['Hey <@!123456789>, !leaderboard'],
//       ['!<@!123456789> ^ !me !leaderboard !tests$*'],
//     ])("'%s' - command can be anywhere in the string", (string) => {
//       expect(commands.leaderboard.regex.test(string)).toBeTruthy();
//     });
//
//     it.each([
//       ['@user!leaderboard'],
//       ["it's about!leaderboard"],
//       ['!leaderboardisanillusion'],
//       ['!leaderboard!'],
//       ['!leaderboard*'],
//       ['!leaderboard...'],
//     ])(
//       "'%s' - command should be its own word!group - no leading or trailing characters",
//       (string) => {
//         expect(commands.leaderboard.regex.test(string)).toBeFalsy();
//       },
//     );
//   });
//
//   describe('callback', () => {
//     it('returns correct output', async () => {
//       const members = generateLeaderData(5);
//
//       axios.get = jest.fn();
//       axios.get.mockResolvedValue({
//         data: members,
//       });
//
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=5 start=1',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=3 start=1',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=2 start=3',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard start=3',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=2',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=2 start=wtf',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=wtf start=3',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=25 start=9999',
//         }),
//       ).toMatchSnapshot();
//     });
//   });
// });
// describe('!leaderboard', () => {
//   describe('regex', () => {
//     it.each([
//       ['!leaderboard'],
//       ['<@!123456789> !leaderboard'],
//       ['!leaderboard n=10 start=30'],
//       ['!leaderboard n=20 start=50'],
//       ['!leaderboard n=10'],
//       ['!leaderboard start=30'],
//     ])('correct strings trigger the callback', (string) => {
//       expect(commands.leaderboard.regex.test(string)).toBeTruthy();
//     });
//
//     it.each([
//       ['!leaderboad'],
//       [''],
//       [' '],
//       [' !'],
//       ['!lead'],
//       ['leaderboard'],
//       ['!le'],
//       ['!leaderboards'],
//       ['```function("!leaderboard", () => {}```'],
//       ['!leader'],
//       ['<@!123456789> ! leaderboard'],
//       ['<@!123456789> !leaderbard'],
//       ['!leaderbord n=10 start=30'],
//     ])("'%s' does not trigger the callback", (string) => {
//       expect(commands.leaderboard.regex.test(string)).toBeFalsy();
//     });
//
//     it.each([
//       ['Check this out! !leaderboard'],
//       ["Don't worry about !leaderboard"],
//       ['Hey <@!123456789>, !leaderboard'],
//       ['!<@!123456789> ^ !me !leaderboard !tests$*'],
//     ])("'%s' - command can be anywhere in the string", (string) => {
//       expect(commands.leaderboard.regex.test(string)).toBeTruthy();
//     });
//
//     it.each([
//       ['@user!leaderboard'],
//       ["it's about!leaderboard"],
//       ['!leaderboardisanillusion'],
//       ['!leaderboard!'],
//       ['!leaderboard*'],
//       ['!leaderboard...'],
//     ])(
//       "'%s' - command should be its own word/group - no leading or trailing characters",
//       (string) => {
//         expect(commands.leaderboard.regex.test(string)).toBeFalsy();
//       },
//     );
//   });
//
//   describe('callback', () => {
//     it('returns correct output', async () => {
//       const members = generateLeaderData(5);
//
//       axios.get = jest.fn();
//       axios.get.mockResolvedValue({
//         data: members,
//       });
//
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=5 start=1',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=3 start=1',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=2 start=3',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard start=3',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=2',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=2 start=wtf',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=wtf start=3',
//         }),
//       ).toMatchSnapshot();
//       expect(
//         await commands.leaderboard.cb({
//           guild: new GuildMock(members),
//           content: '!leaderboard n=25 start=9999',
//         }),
//       ).toMatchSnapshot();
//     });
//   });
// });



// describe('!points', () => {
//   const author = {
//     id: '111333',
//     displayName: 'odin'
//   }
//   const mentionedUser = {
//     id: '222444',
//     displayName: "NotOdin"
//   };
//
//   const data = {
//     author,
//     guild: Guild([author, mentionedUser])
//   }
//
//   describe('regex', () => {
//     it.each([
//       ['!points <@!123456789>'],
//       ['let me check out my !points <@!123456789>'],
//       ['!points <@!123456789> <@!123456789>-v2'],
//       ['!points'],
//     ])('correct strings trigger the callback', (string) => {
//       expect(commands.points.regex.test(string)).toBeTruthy();
//     });
//
//     it('returns author points information if no other user were provided', async () => {
//       data.content = '!points';
//       const axiosData = {
//         data: {
//           points: 5,
//           rank: 1,
//         }
//       };
//
//       axios.get = jest.fn(() => axiosData);
//       const reply = await commands.points.cb(data);
//
//       expect(reply).toMatchSnapshot();
//       expect(axios.get).toHaveBeenCalled();
//     });
//
//     it('return correct user points information if specified', async () => {
//       data.content = '!points <@222444>';
//       const axiosData = {
//         data: {
//           points: 20,
//           rank: 1,
//         }
//       };
//
//       axios.get = jest.fn(() => axiosData);
//       const reply = await commands.points.cb(data);
//
//       expect(reply).toMatchSnapshot();
//       expect(axios.get).toHaveBeenCalled();
//     });
//
//     it('returns correct msg when user has no points', async () => {
//       data.content = '!points <@222444>';
//       const axiosData = {
//         data: {
//           message: "unable to find that user",
//         }
//       };
//
//       axios.get = jest.fn(() => axiosData);
//
//       const reply = await commands.points.cb(data);
//       expect(reply).toMatchSnapshot();
//       expect(axios.get).toHaveBeenCalled();
//     });
//
//     it('GET request not called if user not on disord', async () => {
//       data.content = '!points <@11111111>';
//
//       axios.get = jest.fn();
//       const reply = await commands.points.cb(data);
//
//       expect(reply).toMatchSnapshot();
//       expect(axios.get).not.toHaveBeenCalled();
//     });
//
//     it('format the points word properly for 1 point', async () => {
//       data.content = '!points';
//       const axiosData = {
//         data: {
//           points: 1,
//           rank: 1,
//         }
//       }
//
//       axios.get = jest.fn(() => axiosData);
//       const reply = await commands.points.cb(data);
//
//       expect(reply).toMatchSnapshot();
//       expect(axios.get).toHaveBeenCalled();
//     });
//
//     it('show correct user rank', async () => {
//       data.content = '!points <@222444>';
//       const axiosData = {
//         data: {
//           points: 20,
//           rank: 50
//         }
//       };
//
//       axios.get = jest.fn(() => axiosData);
//       const reply = await commands.points.cb(data);
//
//       expect(reply).toMatchSnapshot();
//       expect(axios.get).toHaveBeenCalled();
//     })
//   });
// });
