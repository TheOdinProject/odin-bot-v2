const { legacy: command } = require('./top');

describe('!top', () => {
  describe('regex', () => {
    it.each([['!top'], [' !top'], ['!top @odin-bot'], ['@odin-bot !top']])(
      'correct strings trigger the callback',
      (string) => {
        expect(command.regex.test(string)).toBeTruthy();
      },
    );

    it.each([['tp'], ['toop'], ['topp'], ['! top'], ['!atop']])(
      "'%s' does not trigger the callback",
      (string) => {
        expect(command.regex.test(string)).toBeFalsy();
      },
    );

    it.each([
      ['Check this out! !top'],
      ["Don't worry about !top"],
      ['Hey @odin-bot, !top'],
      ['!@odin-bot ^ !me !top !tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user!top'],
      ["it's about!top"],
      ['!topanillusion'],
      ['!top!'],
      ['!top*'],
      ['!top...'],
    ])(
      "'%s' - command should be its own word!group - no leading or trailing characters",
      (string) => {
        expect(command.regex.test(string)).toBeFalsy();
      },
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(command.cb()).toMatchSnapshot();
    });
  });
});
