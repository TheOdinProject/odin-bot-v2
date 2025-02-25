const { legacy: command } = require('./code');
const { generateMentions } = require('../../utils/slash-command-helpers/mockData');

describe('!code', () => {
  it.each([
    ['!code'],
    [' !code'],
    ['!code @odin-bot'],
    [' !code @odin-bot'],
    ['!code fmdkslafmksa'],
  ])("'%s' triggers the callback", (string) => {
    expect(command.regex.test(string)).toBeTruthy();
  });

  it.each([
    ['!cfdsdnjae'],
    ['!cood'],
    ['code'],
    ['!cdoe'],
    ['!co de'],
    ['! code'],
    ['@odin-bot ! code'],
    ['!co&d^e'],
    ['!c*od&e^'],
    ['!^code'],
  ])("'%s' does not trigger the callback", (string) => {
    expect(command.regex.test(string)).toBeFalsy();
  });

  it.each([
    ['how to share !code'],
    ['need some !code ?'],
    ['hey @odin-bot, teach me to !code'],
    ['!@odin-bot ^ !me !code !test$*'],
  ])("'%s' - the command can be anywhere in the string", (string) => {
    expect(command.regex.test(string)).toBeTruthy();
  });

  it.each([
    ['!codesgrealkdmsfalnd'],
    ['someone!code'],
    ['@odin-bot!code'],
    ['!code!xx'],
    ['!code*'],
    ['!code...'],
    ['^_!code...'],
  ])(
    "'%s' - command should be its own word!group - no leading or trailing characters",
    (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    },
  );
});

describe('!code snapshot', () => {
  it('returns correct output', () => {
    expect(command.cb(generateMentions(0))).toMatchSnapshot();
    expect(command.cb(generateMentions(1))).toMatchSnapshot();
    expect(command.cb(generateMentions(2))).toMatchSnapshot();
    expect(command.cb(generateMentions(3))).toMatchSnapshot();
  });
});
