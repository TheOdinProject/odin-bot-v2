const command = require('./bootcamps');

describe('?bootcamps', () => {
  describe('regex', () => {
    it.each([
      ['?bootcamps'],
      [' ?bootcamps'],
      ['?bootcamps @odin-bot'],
      ['@odin-bot ?bootcamps'],
    ])('correct strings trigger the callback', (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['botcamps'],
      ['bootcamps'],
      ['bootcamp'],
      ['?bootcamp'],
      ['?bootcmp'],
      ['? bootcamps'],
      ['?abootcamps'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! ?bootcamps'],
      ['Don\'t worry about ?bootcamps'],
      ['Hey @odin-bot, ?bootcamps'],
      ['?@odin-bot ^ ?me ?bootcamps ?tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user?bootcamps'],
      ['it\'s about?bootcamps'],
      ['?bootcampsanillusion'],
      ['?bootcamps?'],
      ['?bootcamps*'],
      ['?bootcamps...'],
    ])("'%s' - command should be its own word/group - no leading or trailing characters", (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    });
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(command.cb()).toMatchSnapshot();
    });
  });
});
