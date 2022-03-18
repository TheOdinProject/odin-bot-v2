const command = require('./windows');

describe('!windows', () => {
  describe('regex', () => {
    it.each([
      ['!windows'],
      [' !windows'],
      ['!windows @odin-bot'],
      ['@odin-bot !windows'],
    ])('correct strings trigger the callback', (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['wndows'],
      ['windows'],
      ['window'],
      ['!wndows'],
      ['!window'],
      ['! windows'],
      ['!awindows'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! !windows'],
      ['Don\'t worry about !windows'],
      ['Hey @odin-bot, !windows'],
      ['!@odin-bot ^ !me !windows !tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user!windows'],
      ['it\'s about!windows'],
      ['!windowsanillusion'],
      ['!windows!'],
      ['!windows*'],
      ['!windows...'],
    ])("'%s' - command should be its own word!group - no leading or trailing characters", (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    });
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(command.cb()).toMatchSnapshot();
    });
  });
});
