const command = require('./carlosQuote');

describe('!cqg', () => {
  it.each([['!cqg'], ['!cqg @odin-bot'], ['@odin-bot !cqg']])(
    "'%s' triggers the callback",
    (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    },
  );

  it.each([
    ['cqgs'],
    ['!c q g'],
    ['!Cqg'],
    [''],
    [' '],
    ['! '],
    ['@odin-bot ! cqg'],
    ['!c&q^g*'],
    ['!cq&^cks|'],
    ['!cq^g'],
  ])("'%s' does not trigger the callback", (string) => {
    expect(command.regex.test(string)).toBeFalsy();
  });

  it.each([
    ['how about dem !cqg'],
    ['i think you should !cqg sometime'],
    ['hey @odin-bot, teach me !cqg'],
    ['!@odin-bot ^ !me !cqg !test$*'],
  ])("'%s' - the command can be anywhere in the string", (string) => {
    expect(command.regex.test(string)).toBeTruthy();
  });

  it.each([
    ['!cqgsgrealkdmsfalnd'],
    ['carlos!cqg'],
    ['!cqg!xx'],
    ['!cqg*'],
    ['!cqg...'],
    ['^_!cqg...'],
  ])(
    "'%s' - command should be its own word!group - no leading or trailing characters",
    (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    },
  );
});

describe('!cqg snapshot', () => {
  it('should return the correct output', () => {
    expect(command.cb()).toMatchSnapshot();
  });
});
