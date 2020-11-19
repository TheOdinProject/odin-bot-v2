jest.mock('../botEngine', ()=>{
  return {
    __esModule: true,
    registerBotCommand: jest.fn((regex, callback) => ({regex, callback}))
  }
})

const botEngine = require('../botEngine')


module.exports = botEngine


