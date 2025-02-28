const { legacy: command } = require('./os');

describe('!os', () => {
  describe('regex', () => {
    it.each([['!os'], [' !os'], ['!os @odin-bot'], ['@odin-bot !os']])(
      'correct strings trigger the callback',
      (string) => {
        expect(command.regex.test(string)).toBeTruthy();
      },
    );

    it.each([['so'], ['os'], ['!so'], ['! os'], ['!aos']])(
      "'%s' does not trigger the callback",
      (string) => {
        expect(command.regex.test(string)).toBeFalsy();
      },
    );

    it.each([
      ['Check this out! !os'],
      ["Don't worry about !os"],
      ['Hey @odin-bot, !os'],
      ['!@odin-bot ^ !me !os !tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user!os'],
      ["it's about!os"],
      ['!osanillusion'],
      ['!os!'],
      ['!os*'],
      ['!os...'],
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
