jest.mock('../botEngine', ()=>{
  return {
    __esModule: true,
    registerBotCommand: jest.fn((regex, callback) => ({regex, callback}))
  }
})

const botEngine = require('../botEngine')

describe('Bot Engine Mock', ()=>{
  const object = botEngine.registerBotCommand('/\B\/hello', ()=> 'Hello!')
  test('registerBotCommand mock returns object',()=> {
    expect(object).toHaveProperty('regex')
    expect(object).toHaveProperty('callback')
  })
  test('returned object includes valid data',()=> {
    expect(object.regex).toBe('/\B\/hello')
    expect(object.callback()).toBe('Hello!')
  })
})

module.exports = botEngine


