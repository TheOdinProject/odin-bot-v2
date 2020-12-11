const command = require("./partyParrot");

describe("/partyparrot", () => {
  it.each([
    ["party parrot"],
    ["/party parrot"],
    ["party_parrot"],
    ["/party_parrot"],
    ["/partyparrot"],
    ["oiseau"],
    ["/oiseau"],
    ["/partyparrot"],
  ])("'%s' triggers the callback", (string) => {
    expect(command.regex.test(string)).toBeTruthy();
  });

  it.each([
    ["part yparrot"],
    ["party"],
    ["parrot"],
    ["partiesparrot"],
    ["parrot party"],
    ["party pants parrot"],
    ["PARTY PARROT"],
    ["partying parrot"],
    ["parrot partying"],
    ["party-parrot"],
    [""],
    [" "],
    ["/ "],
  ])("'%s' does not trigger the callback", (string) => {
    expect(command.regex.test(string)).toBeFalsy();
  });

  it.each([
    ["hello /party parrot"],
    ["need me some /party parrot"],
    ["hey @odin-bot, teach me how to /party parrot"],
    ["/@odin-bot ^ /me /party_parrot /test$*"],
    ["this is a long test string with a randomly placed party parrot command"],
    ["/oiseaugrealkdmsfalnd"],
    ["someone/party_parrot"],
    ["/party parrot/xx"],
    ["/partyparrot*"],
    ["/partyparrot..."],
    ["^_/oiseau..."],
  ])("'%s' - the command can be anywhere in the string", (string) => {
    expect(command.regex.test(string)).toBeTruthy();
  });
});

describe("partyparrot snapshot", () => {
  it.each([["party parrot"], ["partyparrot"], ["party_parrot"], ["oiseau"]])(
    "'%s' - should return the correct output",
    (string) => {
      expect(command.regex.test({ content: string })).toMatchSnapshot();
    }
  );
});
