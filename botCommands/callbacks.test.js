const callbacks = require('./callbacks')
const botEngine = require('./mockBotEngine')

describe('/callbacks', ()=>{
    // command holds an object with the properties 'regex' and 'callback', which are values we pass in to botEngine.registerBotCommand()
    const command = botEngine.registerBotCommand(/\B\/callbacks/, () => `**DID SOMEONE SAY CALLBACKS?: https://briggs.dev/blog/understanding-callbacks**`)

    test('correct strings trigger the callback',()=> {
        // Use .test() to check if the regex finds a match against the string
        expect(command.regex.test('/callbacks')).toBeTruthy()

        expect(command.regex.test('/callbacks @odin-bot')).toBeTruthy()
    })
    test('incorrect strings do not trigger the callback',()=> {
        // Alternatively, we want to ensure that the *incorrect* strings don't trigger the command
        expect(command.regex.test('/coolbacks')).toBeFalsy()
        expect(command.regex.test('/cllbacks')).toBeFalsy() 
    })
})

