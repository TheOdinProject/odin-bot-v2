const command = require('./shrug')

describe('/shrug', () => {
  const permutations = "SHRUG HSRUG RSHUG SRHUG HRSUG RHSUG UHSRG HUSRG SUHRG USHRG HSURG SHURG SRUHG RSUHG USRHG SURHG RUSHG URSHG URHSG RUHSG HURSG UHRSG RHUSG HRUSG GRUSH RGUSH UGRSH GURSH RUGSH URGSH SRGUH RSGUH GSRUH SGRUH RGSUH GRSUH GUSRH UGSRH SGURH GSURH USGRH SUGRH SURGH USRGH RSUGH SRUGH URSGH RUSGH HUSGR UHSGR SHUGR HSUGR USHGR SUHGR GUHSR UGHSR HGUSR GHUSR UHGSR HUGSR HSGUR SHGUR GHSUR HGSUR SGHUR GSHUR GSUHR SGUHR UGSHR GUSHR SUGHR USGHR RSGHU SRGHU GRSHU RGSHU SGRHU GSRHU HSRGU SHRGU RHSGU HRSGU SRHGU RSHGU RGHSU GRHSU HRGSU RHGSU GHRSU HGRSU HGSRU GHSRU SHGRU HSGRU GSHRU SGHRU UGHRS GUHRS HUGRS UHGRS GHURS HGURS RGUHS GRUHS URGHS RUGHS GURHS UGRHS UHRGS HURGS RUHGS URHGS HRUGS RHUGS RHGUS HRGUS GRHUS RGHUS HGRUS GHRUS"
  const permutationsArr = permutations.split(" ").map(item => {
    return [`${item.toLowerCase()}`]
  })

  describe('regex', () => {
    it.each(permutationsArr)('correct strings trigger the callback', (string) => {
      expect(command.regex.test("/" + string)).toBeTruthy()
    })
    it.each([
      ['/shrugs'],
      ['shrug'],
      ['/shurgs'],
      ['/shrg'],
      ['```function("/shrug", () => {}```'],
      ['/shurg'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / shrug'],
      ['/shru&g'],
      ['/shr^ug'],
      ['/shrug!'],
      ['@odin-bot/ shrug'],
      ['https://shrug.com']
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy()
    })
    it.each([
      ['Check this out! /shrug'],
      ['Don\'t worry about /shrug'],
      ['Hey @odin-bot, /shrug'],
      ['/@odin-bot ^ /me /shrug /tests$*']
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy()
    })
    it.each([
      ['@user/shrug'],
      ['it\'s about/shrug'],
      ['/shrugisanillusion'],
      ['/shrug/'],
      ['/shrug*'],
      ['/shrug...']
    ])("'%s' - command should be its own word/group - no leading or trailing characters", (string) => {
      expect(command.regex.test(string)).toBeFalsy()
    })
  })
  describe('callback', () => {
    it.each(permutationsArr)('returns correct output', (content) => {
      expect(command.cb({ content })).toMatchSnapshot()
    })
  })
})
