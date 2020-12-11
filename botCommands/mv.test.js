const command = require("./mv");

describe("/mv", () => {
  it.each([["/mv"], ["/mv @odin-bot"], ["@odin-bot /mv"]])(
    "'%s' triggers the callback",
    (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    }
  );

  it.each([
    ["mvs"],
    ["/m v"],
    ["/Mv"],
    [""],
    [" "],
    ["/ "],
    ["@odin-bot / mv"],
    ["/m&v^*"],
    ["/&^mv|"],
    ["/m^v"],
  ])("'%s' does not trigger the callback", (string) => {
    expect(command.regex.test(string)).toBeFalsy();
  });

  it.each([
    ["how about /mv"],
    ["i think you should /mv sometime"],
    ["hey @odin-bot, teach me /mv"],
    ["/@odin-bot ^ /me /mv /test$*"],
  ])("'%s' - the command can be anywhere in the string", (string) => {
    expect(command.regex.test(string)).toBeTruthy();
  });

  it.each([
    ["/mvgsgrealkdmsfalnd"],
    ["carlos/mv"],
    ["/mv/xx"],
    ["/mv*"],
    ["/mv..."],
    ["^_/mv..."],
  ])(
    "'%s' - command should be its own word/group - no leading or trailing characters",
    (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    }
  );
});

describe("/mv snapshot", () => {
  it("should return the correct output", () => {
    expect(command.cb()).toMatchSnapshot();
  });
});
