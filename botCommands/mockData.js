const { Collection, ClientUser } = require("discord.js")
const {User} = require('./points.test')

const generateMentions = (number) => {
  const collection = new Collection()

  for (let i = 0; i < number; i++) {
    collection.set(`User${i + 1}`,
      new ClientUser('client',
        {
          id: i + 1,
          username: `User${i + 1}`
        })
    )
  }

  return {
    mentions: {
      users: collection
    }
  }
}


const generateLeaderData = (num) => {
  let arr = []
  let id = 100
  let points = 1000

  for (let i = 0; i < num; i++){
    arr.push({
      id: id,
      discord_id: id,
      points: points,
      displayName : `user${id}`
    })
    id++
    points--
  }

  return arr
}




module.exports = {
  generateMentions,
  generateLeaderData
}

