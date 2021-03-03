const commands = require("./help");
const { generateMentions } = require('./mockData');

describe("/help", () => {
  it.each([
    ["/help"],
    [" /help"],
    ["/help @odin-bot"],
    ["/help me please"],
    ["/help @user"],
    [" /help @user"],
  ])("'%s' triggers the callback", (string) => {
    expect(commands.help.regex.test(string)).toBeTruthy();
  });

  it.each([
    ["/hmadpofdsnja"],
    ["/halp"],
    ["help"],
    ["/hlpe"],
    ["/he lp"],
    ["/ help"],
    ["@odin-bot / help"],
    ["/he&l^p"],
    ["/h*el&p^"],
    ["/^help"],
  ])("'%s' does not trigger the callback", (string) => {
    expect(commands.help.regex.test(string)).toBeFalsy();
  });

  it.each([
    ["send /help"],
    ["need some /help ?"],
    ["hey @odin-bot, teach me /help"],
    ["/@odin-bot ^ /me /help /test$*"],
  ])("'%s' - the command can be anywhere in the string", (string) => {
    expect(commands.help.regex.test(string)).toBeTruthy();
  });

  it.each([
    ["/helpsgrealkdmsfalnd"],
    ["someone/help"],
    ["/help/xx"],
    ["/help*"],
    ["/help..."],
    ["^_/help..."],
  ])(
    "'%s' - command should be its own word/group - no leading or trailing characters",
    (string) => {
      expect(commands.help.regex.test(string)).toBeFalsy();
    }
  );
});

describe("/help snapshot", () => {
  it("should return the correct output", () => {
    expect(commands.help.cb({})).toMatchSnapshot();
  });
});

describe("/code", () => {
  it.each([
    ["/code"],
    [" /code"],
    ["/code @odin-bot"],
    [" /code @odin-bot"],
    ["/code fmdkslafmksa"],
  ])("'%s' triggers the callback", (string) => {
    expect(commands.code.regex.test(string)).toBeTruthy();
  });

  it.each([
    ["/cfdsdnjae"],
    ["/cood"],
    ["code"],
    ["/cdoe"],
    ["/co de"],
    ["/ code"],
    ["@odin-bot / code"],
    ["/co&d^e"],
    ["/c*od&e^"],
    ["/^code"],
  ])("'%s' does not trigger the callback", (string) => {
    expect(commands.code.regex.test(string)).toBeFalsy();
  });

  it.each([
    ["how to share /code"],
    ["need some /code ?"],
    ["hey @odin-bot, teach me to /code"],
    ["/@odin-bot ^ /me /code /test$*"],
  ])("'%s' - the command can be anywhere in the string", (string) => {
    expect(commands.code.regex.test(string)).toBeTruthy();
  });

  it.each([
    ["/codesgrealkdmsfalnd"],
    ["someone/code"],
    ["@odin-bot/code"],
    ["/code/xx"],
    ["/code*"],
    ["/code..."],
    ["^_/code..."],
  ])(
    "'%s' - command should be its own word/group - no leading or trailing characters",
    (string) => {
      expect(commands.code.regex.test(string)).toBeFalsy();
    }
  );
});

describe('/code snapshot', () => {
  it('returns correct output', () => {
    expect(commands.code.cb(generateMentions(0))).toMatchSnapshot()
    expect(commands.code.cb(generateMentions(1))).toMatchSnapshot()
    expect(commands.code.cb(generateMentions(2))).toMatchSnapshot()
    expect(commands.code.cb(generateMentions(3))).toMatchSnapshot()
  })
})



