const commands = require('./help');

describe('!help', () => {
  it.each([
    ['!help'],
    [' !help'],
    ['!help @odin-bot'],
    ['!help me please'],
    ['!help @user'],
    [' !help @user'],
  ])("'%s' triggers the callback", (string) => {
    expect(commands.help.regex.test(string)).toBeTruthy();
  });

  it.each([
    ['!hmadpofdsnja'],
    ['!halp'],
    ['help'],
    ['!hlpe'],
    ['!he lp'],
    ['! help'],
    ['@odin-bot ! help'],
    ['!he&l^p'],
    ['!h*el&p^'],
    ['!^help'],
  ])("'%s' does not trigger the callback", (string) => {
    expect(commands.help.regex.test(string)).toBeFalsy();
  });

  it.each([
    ['send !help'],
    ['need some !help ?'],
    ['hey @odin-bot, teach me !help'],
    ['!@odin-bot ^ !me !help !test$*'],
  ])("'%s' - the command can be anywhere in the string", (string) => {
    expect(commands.help.regex.test(string)).toBeTruthy();
  });

  it.each([
    ['!helpsgrealkdmsfalnd'],
    ['someone!help'],
    ['!help!xx'],
    ['!help*'],
    ['!help...'],
    ['^_!help...'],
  ])(
    "'%s' - command should be its own word!group - no leading or trailing characters",
    (string) => {
      expect(commands.help.regex.test(string)).toBeFalsy();
    },
  );
});

describe('!help snapshot', () => {
  it('should return the correct output', () => {
    expect(commands.help.cb({})).toMatchSnapshot();
  });
});
