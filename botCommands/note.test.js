const command = require('./command')

describe('/note', () => {
  describe('regex', () => {
    /* Jest requires an array of arrays (also called a table) to be passed in so we may test each string with the same case */
    /* For more information: https://jestjs.io/docs/en/api#testeachtablename-fn-timeout */
    it.each([
      ['/note'],
      [' /note'],
      ['/note @odin-bot'],
      ['@odin-bot /note'],
    ])('correct strings trigger the callback', (string) => {
      expect(command.regex.test(string)).toBeTruthy()
    })
    
    it.each([
     /* incorrect variations of the string such as typos, mispellings, similar words, etc in the same formatting as the above */
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy()
    })

    // We also want to check to see if commands can be called from anywhere in a message
    it.each([
      ['Check this out! /note'],
      ['Don\'t worry about /note'],
      ['Hey @odin-bot, /note'],
      ['/@odin-bot ^ /me /time /note$*']
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy()
    })

    it.each([
      ['@user/note'],
      ['it\'s about/note'],
      ['/notesanillusion'],
      ['/note/'],
      ['/note*'],
      ['/note...']
    ])("'%s' - command should be its own word/group - no leading or trailing characters", (string) => {
      expect(command.regex.test(string)).toBeFalsy()
    })
  })

  describe('callback', () => {
    it('returns correct output', () => {
      expect(command.cb()).toMatchSnapshot()
    })
  })
})