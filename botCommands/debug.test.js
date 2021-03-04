const command = require('./debug');

describe('/debug', () => {
  it.each([
    ['/debug'],
    [' /debug'],
    ['/debug @odin-bot'],
    [' /debug @odin-bot'],
    ['/debug js'],
    ['/debug rb'],
    [' /debug js'],
    [' /debug rb'],
    ['/debug js @odin-bot'],
    ['/debug rb @odin-bot'],
    [' /debug js @odin-bot'],
    [' /debug rb @odin-bot'],
  ])("'%s' triggers the callback", (string) => {
    expect(command.regex.test(string)).toBeTruthy();
  });

  it.each([
    ['/debog'],
    ['debugs'],
    ['/dbug'],
    ['/de bug'],
    ['/debugging'],
    ['```function("/de bug", () => {}```'],
    ['/Debug'],
    [''],
    [' '],
    ['/ '],
    ['@odin-bot / debug'],
    ['/de&b^ug'],
    ['/d^bug'],
    ['@odin-bot/ debug'],
  ])("'%s' does not trigger the callback", (string) => {
    expect(command.regex.test(string)).toBeFalsy();
  });

  it.each([
    ['how about a flavour of /debug'],
    ['i think /debug is great'],
    ['hey @odin-bot, teach me to /debug'],
    ['/@odin-bot ^ /me /debug /test$*'],
  ])("'%s' - the command can be anywhere in the string", (string) => {
    expect(command.regex.test(string)).toBeTruthy();
  });

  it.each([
    ['@user/debug'],
    ['watchaknowabout/debug'],
    ['/debugsgrealkdmsfalnd'],
    ['/debug/'],
    ['/debug*'],
    ['/debug...'],
  ])(
    "'%s' - command should be its own word/group - no leading or trailing characters",
    (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    },
  );
});

describe('/debug', () => {
  it('should return the correct output', () => {
    expect(command.cb({ content: '/debug' })).toMatchSnapshot();
  });
});

describe('/debug js', () => {
  it('should return the correct output', () => {
    expect(command.cb({ content: '/debug js' })).toMatchSnapshot();
  });
});

describe('/debug rb', () => {
  it('should return the correct output', () => {
    expect(command.cb({ content: '/debug rb' })).toMatchSnapshot();
  });
});
