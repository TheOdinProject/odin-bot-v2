const question = require('./question-legacy');

describe('!question', () => {
  describe('regex', () => {
    it.each([
      ['!question'],
      [' !question'],
      ['!question @odin-bot'],
      ['@odin-bot !question'],
    ])('correct strings trigger the callback', (string) => {
      expect(question.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['!quest'],
      ['question'],
      ['!questio'],
      ['!questions'],
      ['```function("!question", () => {}```'],
      ['!questiona'],
      [''],
      [' '],
      [' !'],
      ['@odin-bot ! question'],
      ['!ques&tion'],
      ['!quest^ion'],
      ['!question!'],
      ['@odin-bot! question'],
      ['https:!!question.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(question.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! !question'],
      ["Don't worry about !question"],
      ['Hey @odin-bot, !question'],
      ['!@odin-bot ^ !me !question !tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(question.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user!question'],
      ["it's about!question"],
      ['!questionisanillusion'],
      ['!question!'],
      ['!question*'],
      ['!question...'],
    ])(
      "'%s' - command should be its own word!group - no leading or trailing characters",
      (string) => {
        expect(question.regex.test(string)).toBeFalsy();
      },
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(question.cb()).toMatchSnapshot();
    });
  });
});
