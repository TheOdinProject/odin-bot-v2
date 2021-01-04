const commands = require('./points')
const generateMentions = require('./mockData')
const axios = require('axios')
jest.mock('axios')

describe('add points', ()=>{

  describe('regex',()=> {
    xit.each([
      ['@odin-bot ++'],
      ['thanks @odin-bot ++'],
      ['@odin-bot++']
    ])('correct strings trigger the callback', (string) => {
      expect(commands.awardPoints.regex.test(string)).toBeTruthy()
    })

    xit.each([
      ['++'],
      [''],
      [' '],
      [' /'],
      ['odin-bot++'],
      ['/++'],
      ['```function("@odin-bot ++", () => {}```'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeFalsy()
    })

    xit.each([
      ['Check this out! @odin-bot ++'],
      ['Don\'t worry about it @odin-bot ++'],
      ['Hey @odin-bot ++'],
      ['/ @odin-bot++ ^ /me /leaderboard /tests$*']
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeTruthy()
    })
    
    xit.each([
      ['@user/++'],
      ['it\'s about/@odin-bot++'],
      ['@odin-bot++isanillusion'],
      ['@odin-bot++/'],
      ['@odin-bot++*'],
      ['@odin-bot++...']
    ])("'%s' - command should be its own word/group - no leading or trailing characters", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeFalsy()
    })
  })

  describe('callback', () => {
     const {Guild, Channel, Client, User} = require('discord.js')
     const user = User([{name: 'club-40'}],1, 10)
     // in order to filter properly, the user or users must be passed in as an array
     const client = Client([user])  

     // this is an inelegant solution that does not allow for dynamic users to be passed in
     axios.post.mockResolvedValue({data: 
       {
         ...user, 
         points: user.points++
       }
     })

     const mockSend = jest.fn()

     mockSend.mockImplementation(message => {
       console.log(message)
      return message
    })

     jest.mock('discord.js', () => {
       return {
         Client : jest.fn().mockImplementation((users, user) => {
           return {
             // we use a template string here to ensure that the user ID is able to be filtered against the formatting of the array of mocked Users we pass in
             users : {
               get : (userId) => users.filter(user => `<@${userId}>` === user.id)
             },
             // dynamically generated user so we can test for client/odin bot user
             user : user
           }
         }),
 
         Guild : jest.fn().mockImplementation(() => {
           return {
             members : {
               
             },
             
             member : (userArray) => {
               return userArray[0]
             }
           }
         }),

         Channel : jest.fn().mockImplementation(() => {
           return {
             send: mockSend
           }
         }),

         User : jest.fn().mockImplementation((roles, id, points) => {
           return {
             roles: roles,
             id: `<@${id}>`,
             points: points,
             addRole: ()=> {roles.push('club-40')}
           }
         })
       }
     })
     
    it('returns correct output for a single user w/o club-40', async () => {
      // single non club 40 user
      const data = {
        // author can just be a standard user
        author : user,
        content: `${user.id} ++`,
        channel : {
          send: jest.fn()
        },
        client :  client,
        guild : Guild()
      }
      await commands.awardPoints.cb(data)
      expect(data.channel.send).toHaveBeenCalled()
      expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot()    
    })

    it('returns correct output for a single user entering club-4', async () => {
      // single non club 40 user
      const data = {
        // author can just be a standard user
        author : user,
        content: `${user.id} ++`,
        channel : {
          send: jest.fn()
        },
        client :  client,
        guild : Guild()
      }
      await commands.awardPoints.cb(data)
      expect(data.channel.send).toHaveBeenCalled()
      expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot()    
    })

    it('returns correct output for multiple users', async () => {
      // single non club 40 user
      const data = {
        // author can just be a standard user
        author : user,
        content: `${user.id} ++`,
        channel : {
          send: jest.fn()
        },
        client :  client,
        guild : Guild()
      }
      await commands.awardPoints.cb(data)
      expect(data.channel.send).toHaveBeenCalled()
      expect(data.channel.send.mock.calls[0][0]).toMatchSnapshot()    
    })
  })
})

describe('deduct points', ()=>{

  describe('regex',()=> {
    xit.each([
      ['@odin-bot --'],
      ['thanks @odin-bot --'],
      ['@odin-bot--']
    ])('correct strings trigger the callback', (string) => {
    
    })
    xit.each([
      ['--'],
      [''],
      [' '],
      [' /'],
      ['odin-bot--'],
      ['/--'],
      ['```function("@odin-bot --", () => {}```'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeFalsy()
    })

    xit.each([
      ['Check this out! @odin-bot --'],
      ['Don\'t worry about it @odin-bot --'],
      ['Hey @odin-bot --'],
      ['/ @odin-bot-- ^ /me /leaderboard /tests$*']
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeTruthy()
    })
    
    xit.each([
      ['@user/--'],
      ['it\'s about/@odin-bot--'],
      ['@odin-bot--isanillusion'],
      ['@odin-bot--/'],
      ['@odin-bot--*'],
      ['@odin-bot--...']
    ])("'%s' - command should be its own word/group - no leading or trailing characters", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeFalsy()
    })
  })

  describe('callback', () => {
    xit('returns correct output', async () => {
      expect(commands.deductPoints()).toMatchSnapshot()
    })
  })
})

describe('/points', ()=>{
  describe('regex',()=> {
    xit.each([
      ['/points @odin-bot'],
      ['let me check out my /points @odin-bot'],
      ['/points @odin-bot @odin-bot-v2']
    ])('correct strings trigger the callback', (string) => {
      expect(commands.points.regex.test(string)).toBeTruthy()
    })
  })
})

describe('/leaderboard', ()=>{

  describe('regex',()=> {
    xit.each([
      ['/leaderboard'],
      ['@odin-bot /leaderboard'],
      ['/leaderboard n=10 start=30'],
      ['/leaderboard n=20 start=50'],
      ['/leaderboard n=10'],
      ['/leaderboard start=30']
    ])('correct strings trigger the callback', (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeTruthy()
    })

    xit.each([
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

    xit.each([
      ['Check this out! /leaderboard'],
      ['Don\'t worry about /leaderboard'],
      ['Hey @odin-bot, /leaderboard'],
      ['/@odin-bot ^ /me /leaderboard /tests$*']
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.leaderboard.regex.test(string)).toBeTruthy()
    })

    xit.each([
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
    xit('returns correct output', async () => {
      expect(await commands.leaderboard.cb("/leaderboard n=10 start=10")).toMatchSnapshot()
    })
  })
})
