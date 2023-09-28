const command = require('./google-legacy');

describe('!google', () => {
  describe('regex', () => {
    it.each([
      ['!google query'],
      [' !google query'],
      ['!google query @odin-bot'],
      ['@odin-bot !google query'],
    ])('correct strings trigger the callback', (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['!googl'],
      ['google'],
      ['!goog'],
      ['!googless'],
      ['```function("!google", () => {}```'],
      ['!googles'],
      [''],
      [' '],
      [' !'],
      ['@odin-bot ! google'],
      ['!goo&gle'],
      ['!goo^gle'],
      ['!google!'],
      ['@odin-bot! google'],
      ['https:!!google.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! !google query'],
      ["Don't worry about !google query"],
      ['Hey @odin-bot, !google query'],
      ['!@odin-bot ^ !me !google !tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user!google'],
      ["it's about!google"],
      ['!googleisanillusion'],
      ['!google!'],
      ['!google*'],
      ['!google...'],
    ])(
      "'%s' - command should be its own word!group - no leading or trailing characters",
      (string) => {
        expect(command.regex.test(string)).toBeFalsy();
      },
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(
        command.cb({ content: '!google The Odin Project' }),
      ).toMatchSnapshot();
    });
  });
});
