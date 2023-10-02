const command = require('./searchtop-legacy');

describe('!searchtop', () => {
  describe('regex', () => {
    it.each([
      ['!searchtop query'],
      [' !searchtop query'],
      ['!searchtop query @odin-bot'],
      ['@odin-bot !searchtop query'],
    ])('correct strings trigger the callback', (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['!searchto'],
      ['searchtop'],
      ['!searcht'],
      ['!search top'],
      ['```function("!searchtop", () => {}```'],
      ['!searchingtop'],
      [''],
      [' '],
      [' !'],
      ['@odin-bot ! searchtop'],
      ['!search-top'],
      ['!searc^htop'],
      ['!searchtop!'],
      ['@odin-bot! searchtop'],
      ['https:!!searchtop.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! !searchtop query'],
      ["Don't worry about !searchtop query"],
      ['Hey @odin-bot, !searchtop query'],
      ['!@odin-bot ^ !me !searchtop !tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user!searchtop'],
      ["it's about!searchtop"],
      ['!searchtopnow'],
      ['!searchtop!'],
      ['!searchtop*'],
      ['!searchtop...'],
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
        command.cb({ content: '!searchtop The Odin Project' }),
      ).toMatchSnapshot();
    });
  });
});
