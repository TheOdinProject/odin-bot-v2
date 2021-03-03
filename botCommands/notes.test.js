/* eslint-disable */
const command = require('./notes')

describe('/notes', () => {
  describe('regex', () => {
    it.each([
      ['/notes'],
      [' /notes'],
      ['/notes @odin-bot'],
      ['@odin-bot /notes'],
    ])('correct strings trigger the callback', (string) => {
      expect(command.regex.test(string)).toBeTruthy()
    })

    it.each([
      ["ntoes"],
      ["notes"],
      ["noets"],
      ["/noets"],
      ["/ntoes"],
      ["/ notes"],
      ["/anotes"]
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy()
    })

    it.each([
      ['Check this out! /notes'],
      ['Don\'t worry about /notes'],
      ['Hey @odin-bot, /notes'],
      ['/@odin-bot ^ /me /notes /tests$*']
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy()
    })

    it.each([
      ['@user/notes'],
      ['it\'s about/notes'],
      ['/notesanillusion'],
      ['/notes/'],
      ['/notes*'],
      ['/notes...']
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
