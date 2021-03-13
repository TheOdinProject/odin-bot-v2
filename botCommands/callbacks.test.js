const command = require('./callbacks');

describe('/callbacks', () => {
  it.each([
    ['/callbacks'],
    [' /callbacks'],
    ['/callbacks @odin-bot'],
    [' /callbacks @odin-bot'],
  ])("'%s' triggers the callback", (string) => {
    expect(command.regex.test(string)).toBeTruthy();
  });

  it.each([
    ['/coolbacks'],
    ['callbacks'],
    ['/cllbacks'],
    ['/callback'],
    ['/call backs'],
    ['```function("/call backs", () => {}```'],
    ['/CallBacks'],
    [''],
    [' '],
    ['/ '],
    ['@odin-bot / callbacks'],
    ['/call&ba^cks'],
    ['/callba^cks'],
    ['@odin-bot/ callbacks'],
  ])("'%s' does not trigger the callback", (string) => {
    expect(command.regex.test(string)).toBeFalsy();
  });

  it.each([
    ['how about dem /callbacks'],
    ['i think /callbacks are great'],
    ['hey @odin-bot, teach me /callbacks'],
    ['/@odin-bot ^ /me /callbacks /test$*'],
  ])("'%s' - the command can be anywhere in the string", (string) => {
    expect(command.regex.test(string)).toBeTruthy();
  });

  it.each([
    ['@user/callbacks'],
    ['watchaknowabout/callbacks'],
    ['/callbackssgrealkdmsfalnd'],
    ['/callbacks/'],
    ['/callbacks*'],
    ['/callbacks...'],
  ])(
    "'%s' - command should be its own word/group - no leading or trailing characters",
    (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    },
  );
});

describe('/callbacks callback', () => {
  it('should return the correct output', () => {
    expect(command.cb()).toMatchSnapshot();
  });
});
