const axios = require('axios');
const commands = require('./leaderboard');
const { generateLeaderData } = require('./mockData');
/* eslint-disable */
/* eslint max-classes-per-file: ["error", 2] */

class GuildMembersMock {
  members;

  cache;

  constructor(users) {
    this.members = users;
    this.cache = {
      get: (id) => users.filter((member) => member.discord_id === id)[0],
    };
  }
}

class GuildMock {
  members;

  member;

  constructor(users) {
    this.members = new GuildMembersMock(users);
    this.member = (user) => users.filter((member) => member === user)[0];
  }
}

describe('!leaderboard', () => {
  describe('regex', () => {
    it.each([
      ['!leaderboard'],
      ['<@!123456789> !leaderboard'],
      ['!leaderboard n=10 start=30'],
      ['!leaderboard n=20 start=50'],
      ['!leaderboard n=10'],
      ['!leaderboard start=30'],
    ])('correct strings trigger the callback', (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['!leaderboad'],
      [''],
      [' '],
      [' !'],
      ['!lead'],
      ['leaderboard'],
      ['!le'],
      ['!leaderboards'],
      ['```function("!leaderboard", () => {}```'],
      ['!leader'],
      ['<@!123456789> ! leaderboard'],
      ['<@!123456789> !leaderbard'],
      ['!leaderbord n=10 start=30'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! !leaderboard'],
      ["Don't worry about !leaderboard"],
      ['Hey <@!123456789>, !leaderboard'],
      ['!<@!123456789> ^ !me !leaderboard !tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user!leaderboard'],
      ["it's about!leaderboard"],
      ['!leaderboardisanillusion'],
      ['!leaderboard!'],
      ['!leaderboard*'],
      ['!leaderboard...'],
    ])(
      "'%s' - command should be its own word!group - no leading or trailing characters",
      (string) => {
        expect(commands.leaderboard.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    const members = generateLeaderData(5);

    axios.get = jest.fn();
    axios.get.mockResolvedValue({
      data: members,
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(0, 5),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=5 start=1',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(0, 3),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=3 start=1',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(2, 4),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=2 start=3',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(2),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard start=3',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(0, 2),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=2',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(0, 2),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=2 start=wtf',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(2),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=wtf start=3',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(9998, 25),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=25 start=9999',
        })
      ).toMatchSnapshot();
    });
  });
});
describe('!leaderboard', () => {
  describe('regex', () => {
    it.each([
      ['!leaderboard'],
      ['<@!123456789> !leaderboard'],
      ['!leaderboard n=10 start=30'],
      ['!leaderboard n=20 start=50'],
      ['!leaderboard n=10'],
      ['!leaderboard start=30'],
    ])('correct strings trigger the callback', (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['!leaderboad'],
      [''],
      [' '],
      [' !'],
      ['!lead'],
      ['leaderboard'],
      ['!le'],
      ['!leaderboards'],
      ['```function("!leaderboard", () => {}```'],
      ['!leader'],
      ['<@!123456789> ! leaderboard'],
      ['<@!123456789> !leaderbard'],
      ['!leaderbord n=10 start=30'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! !leaderboard'],
      ["Don't worry about !leaderboard"],
      ['Hey <@!123456789>, !leaderboard'],
      ['!<@!123456789> ^ !me !leaderboard !tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user!leaderboard'],
      ["it's about!leaderboard"],
      ['!leaderboardisanillusion'],
      ['!leaderboard!'],
      ['!leaderboard*'],
      ['!leaderboard...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.leaderboard.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    const members = generateLeaderData(5);

    axios.get = jest.fn();
    axios.get.mockResolvedValue({
      data: members,
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(0, 5),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=5 start=1',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(0, 3),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=3 start=1',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(2, 4),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=2 start=3',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(2),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard start=3',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(0, 2),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=2',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(0, 2),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=2 start=wtf',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(2),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=wtf start=3',
        })
      ).toMatchSnapshot();
    });

    it('returns correct output', async () => {
      axios.get.mockResolvedValue({
        data: members.slice(9998, 25),
      });

      expect(
        await commands.leaderboard.cb({
          guild: new GuildMock(members),
          content: '!leaderboard n=25 start=9999',
        })
      ).toMatchSnapshot();
    });
  });
});
