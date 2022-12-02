const command = require('./freelance');

describe('!freelance', () => {
  describe('regex', () => {
    it.each([
      ['!freelance'],
      [' !freelance'],
      ['!freelance @odin-bot'],
      ['@odin-bot !freelance'],
    ])('correct strings trigger the callback', (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['frlnce'],
      ['!frlence'],
      ['!ferlence'],
      ['! freelance'],
      ['!afreelance'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! !freelance'],
      ['Don\'t worry about !freelance'],
      ['Hey @odin-bot, !freelance'],
      ['!@odin-bot ^ !me !freelance !tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user!freelance'],
      ['it\'s about!freelance'],
      ['!freelanceanillusion'],
      ['!freelance!'],
      ['!freelance*'],
      ['!freelance...'],
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
