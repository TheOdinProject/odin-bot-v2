const command = require('./time');
const { generateMentions } = require('./mockData');

describe('!time', () => {
  describe('regex', () => {
    it.each([
      ['!time'],
      [' !time'],
      ['!time @odin-bot'],
      ['@odin-bot !time'],
    ])('correct strings trigger the callback', (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['!tim'],
      ['tie'],
      ['!ti'],
      ['!times'],
      ['```function("!time", () => {}```'],
      ['!timea'],
      [''],
      [' '],
      [' !'],
      ['@odin-bot ! time'],
      ['!tim&e'],
      ['!tim^e'],
      ['!time!'],
      ['@odin-bot! time'],
      ['https:!!time.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! !time'],
      ['Don\'t worry about !time'],
      ['Hey @odin-bot, !time'],
      ['!@odin-bot ^ !me !time !tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user!time'],
      ['it\'s about!time'],
      ['!timeisanillusion'],
      ['!time!'],
      ['!time*'],
      ['!time...'],
    ])("'%s' - command should be its own word!group - no leading or trailing characters", (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    });
  });

  describe('callback', () => {
    it('returns correct output', async () => {
      expect(await command.cb(generateMentions(0))).toMatchSnapshot();
      expect(await command.cb(generateMentions(1))).toMatchSnapshot();
      expect(await command.cb(generateMentions(2))).toMatchSnapshot();
      expect(await command.cb(generateMentions(3))).toMatchSnapshot();
    });
  });
});
