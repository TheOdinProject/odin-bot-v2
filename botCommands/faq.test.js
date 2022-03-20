const command = require('./faq');
const { generateMentions } = require('./mockData');

describe('!faq', () => {
  it.each([['!faq'], [' !faq'], ['!faq @odin-bot'], [' !faq @odin-bot']])(
    "'%s' triggers the callback",
    (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    },
  );

  it.each([
    ['!fEhq'],
    ['fye'],
    ['!f'],
    ['!fq'],
    ['!f a q'],
    ['```function("!faq", () => {}```'],
    ['!FAQ'],
    [''],
    [' '],
    ['! '],
    ['@odin-bot ! faq'],
    ['!fafaq'],
  ])("'%s' does not trigger the callback", (string) => {
    expect(command.regex.test(string)).toBeFalsy();
  });

  it.each([
    ['thats a !faq'],
    ['that gets asked a lot !faq give this a read'],
    ['hey @odin-bot, !faq'],
    ['!@odin-bot ^ !me !faq !test$*'],
  ])("%s' - the command can be anywhere in the string", (string) => {
    expect(command.regex.test(string)).toBeTruthy();
  });

  it.each([
    ['@user!faq'],
    ['watchaknowabout!faq'],
    ['!faqsgrealkdmsfalnd'],
    ['!faq!'],
    ['!faq*'],
    ['!faq...'],
  ])(
    "'%s' - command should be its own word/group - no leading or trailing characters",
    (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    },
  );
});

describe('callback', () => {
  it('should return the correct output', async () => {
    expect(await command.cb(generateMentions(0))).toMatchSnapshot();
    expect(await command.cb(generateMentions(1))).toMatchSnapshot();
    expect(await command.cb(generateMentions(2))).toMatchSnapshot();
    expect(await command.cb(generateMentions(3))).toMatchSnapshot();
  });
});
