const command = require('./wsl');

describe('!wsl', () => {
  describe('regex', () => {
    it.each([
      ['!wsl'],
      [' !wsl'],
      ['!wsl @odin-bot'],
      ['@odin-bot !wsl'],
    ])('correct strings trigger the callback', (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['wndows'],
      ['wsl'],
      ['window'],
      ['!wndows'],
      ['!window'],
      ['! wsl'],
      ['!awsl'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! !wsl'],
      ['Don\'t worry about !wsl'],
      ['Hey @odin-bot, !wsl'],
      ['!@odin-bot ^ !me !wsl !tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user!wsl'],
      ['it\'s about!wsl'],
      ['!wslanillusion'],
      ['!wsl!'],
      ['!wsl*'],
      ['!wsl...'],
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
