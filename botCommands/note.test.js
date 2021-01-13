const command = require('./note')

describe('/note', () => {
  describe('regex', () => {
    it.each([
      ['/note'],
      [' /note'],
      ['/note @odin-bot'],
      ['@odin-bot /note'],
    ])('correct strings trigger the callback', (string) => {
      expect(command.regex.test(string)).toBeTruthy()
    })
    
    it.each([
     ["ntoe"],
     ["note"],
     ["noet"],
     ["/noet"],
     ["/ntoe"],
     ["/ note"],
     ["/anote"]
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy()
    })

    it.each([
      ['Check this out! /note'],
      ['Don\'t worry about /note'],
      ['Hey @odin-bot, /note'],
      ['/@odin-bot ^ /me /note /tests$*']
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