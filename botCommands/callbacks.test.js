const command = require('./callbacks')

describe('/command', ()=>{
    it('correct strings trigger the callback',()=> {
        // Use .test() to check if the regex finds a match against the string
        expect(command.regex.test('/command')).toBeTruthy()
        expect(command.regex.test('/command @odin-bot')).toBeTruthy()
        expect(command.regex.test('@odin-bot /command')).toBeTruthy()
    })
    it('incorrect strings do not trigger the callback',()=> {
        // Alternatively, we want to ensure that the *incorrect* strings don't trigger the command
        expect(command.regex.test('/coolbacks')).toBeFalsy()
        expect(command.regex.test('/cllbacks')).toBeFalsy() 
        expect(command.regex.test('```describe("/callbacks", () => {}```')).toBeFalsy() 
    })
})

