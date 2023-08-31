const command = require('./memory');
const { generateMentions } = require('./mockData');

describe('!memory', () => {
  describe('regex', () => {
    it.each([
      ['!memory'],
      [' !memory'],
      ['!memory @odin-bot'],
      ['@odin-bot !memory'],
    ])('correct strings trigger the callback', (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });
    it.each([
    /* Incorrect variations of the string such as typos, misspellings, similar words, etc */
      ['!memor'],
      ['/memory'],
      ['memory'],
      ['!emory'],
      ['!memories'],
      ['! memory'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    });
    // We also want to check to see if commands can be called from anywhere in a message
    it.each([
      ['Check this out! !memory'],
      ['Don\'t worry about !memory'],
      ['Hey @odin-bot, !memory'],
      ['/@odin-bot ^ /me !memory !tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy();
    });
    // Commands should not trigger unless they are their own distinct phrase or word
    it.each([
      ['@user!memory'],
      ['it\'s about!memory'],
      ['!memorysanillusion'],
      ['!memory/'],
      ['!memory*'],
      ['!memory...'],
    ])("'%s' - command should be its own word/group - no leading or trailing characters", (string) => {
      expect(command.regex.test(string)).toBeFalsy();
    });
  });
  describe('callback', () => {
    it('returns correct output', async () => {
      expect(command.cb()).toMatchSnapshot();
      expect(await command.cb(generateMentions(0))).toMatchSnapshot();
      expect(await command.cb(generateMentions(1))).toMatchSnapshot();
      expect(await command.cb(generateMentions(2))).toMatchSnapshot();
      expect(await command.cb(generateMentions(3))).toMatchSnapshot();
    });
  });
});
