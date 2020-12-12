const commands = require('./points')

describe('add points', ()=>{
  describe('regex',()=> {
    it.each([
      ['@odin-bot ++'],
      ['thanks @odin-bot ++'],
      ['@odin-bot++']
    ])('correct strings trigger the callback', (string) => {
      expect(commands.addPoints.regex.test(string)).toBeTruthy()
    })
  })

  describe('callback', () => {
    expect(commands.addPoints.cb()).toMatchSnapshot()
  })
})

describe('deduct points', ()=>{
  describe('regex',()=> {
    it.each([
      ['@odin-bot --'],
      ['thanks @odin-bot --'],
      ['@odin-bot--']
    ])('correct strings trigger the callback', (string) => {
    
    })

  })
})

describe('/points', ()=>{
  describe('regex',()=> {
    it.each([
      ['/points @odin-bot'],
      ['let me check out my /points @odin-bot'],
      ['/points @odin-bot @odin-bot-v2']
    ])('correct strings trigger the callback', (string) => {
      expect(commands.points.regex.test(string)).toBeTruthy()
    })

  })
})

describe('/leaderboard', ()=>{
// View the points leaderboard with /leaderboard
// Modify it with n= and start= i.e. /leaderboard n=25 start=30
  describe('regex',()=> {
    it.each([
      ['/leaderboard'],
      ['@odin-bot /leaderboard'],
      ['/leaderboard n=10 start=30']
    ])('correct strings trigger the callback', (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeTruthy()
    })

    it.each([
      ['/leaderboad'],
      [''],
      [' '],
      [' /'],
      ['/lead'],
      ['leaderboard'],
      ['/le'],
      ['/leaderboards'],
      ['```function("/leaderboard", () => {}```'],
      ['/leader'],
      ['@odin-bot / leaderboard'],
      ['@odin-bot /leaderbard'],
      ['/leaderbord n=10 start=30']
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeFalsy()
    })

    it.each([
      ['Check this out! /leaderboard'],
      ['Don\'t worry about /leaderboard'],
      ['Hey @odin-bot, /leaderboard'],
      ['/@odin-bot ^ /me /leaderboard /tests$*']
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeTruthy()
    })

    it.each([
      ['@user/leaderboard'],
      ['it\'s about/leaderboard'],
      ['/leaderboardisanillusion'],
      ['/leaderboard/'],
      ['/leaderboard*'],
      ['/leaderboard...']
    ])("'%s' - command should be its own word/group - no leading or trailing characters", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeFalsy()
    })
  })

  describe('callback', () => {
    it('returns correct output', async () => {
      expect(await commands.leaderboard.cb()).toMatchSnapshot()
  })
})
