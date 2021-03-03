/* eslint-disable */
const command = require('./mv')

describe('/mv', () => {
  describe('regex', () => {
    it.each([
      ['/mv'],
      [' /mv'],
      ['/mv @odin-bot'],
      ['@odin-bot /mv'],
    ])('correct strings trigger the callback', (string) => {
      expect(command.regex.test(string)).toBeTruthy()
    })

    it.each([
      ['/v'],
      ['mv'],
      ['/m'],
      ['/mvs'],
      ['```function("/mv", () => {}```'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / mv'],
      ['/m&v'],
      ['/m^v'],
      ['/mv!'],
      ['@odin-bot/ mv'],
      ['https://mv.com']
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy()
    })

    it.each([
      ['Check this out! /mv'],
      ['Don\'t worry about /mv'],
      ['Hey @odin-bot, /mv'],
      ['/@odin-bot ^ /me /mv /tests$*']
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy()
    })

    it.each([
      ['@user/mv'],
      ['it\'s about/mv'],
      ['/mvisanillusion'],
      ['/mv/'],
      ['/mv*'],
      ['/mv...']
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

