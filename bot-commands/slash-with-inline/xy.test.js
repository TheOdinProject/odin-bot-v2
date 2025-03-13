const command = require('./xy').legacy;

describe('!xy', () => {
  it('has the name "xy"', () => {
    expect(command.name).toBe('xy');
  });

  describe('regex', () => {
    it.each([['!xy'], [' !xy'], ['!xy @odin-bot'], ['@odin-bot !xy']])(
      'correct strings trigger the callback',
      (string) => {
        expect(command.regex.test(string)).toBeTruthy();
      },
    );

    it.each([
      ['!yx'],
      ['xy'],
      ['!x'],
      ['!xs'],
      ['```function("!xy", () => {}```'],
      ['!d'],
      [''],
      [' '],
      [' !'],
      ['@odin-bot ! xy'],
      ['!x&y'],
      ['!x^y'],
      ['!xy!'],
      ['@odin-bot! xy'],
      ['https:!!xy.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! !xy'],
      ["Don't worry about !xy"],
      ['Hey @odin-bot, !xy'],
      ['!@odin-bot ^ !me !xy !tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user!xy'],
      ["it's about!xy"],
      ['!xyisanillusion'],
      ['!xy!'],
      ['!xy*'],
      ['!xy...'],
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
