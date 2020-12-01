const { Collection, ClientUser } = require("discord.js")



const zeroMentionData = new Collection()

const singleMentionData = new Collection()
singleMentionData.set('users', new ClientUser('client',
{
    id: 'userID',
    username: 'user'}
    )
)

const twoMentionData = new Collection()
twoMentionData.set('firstUser', new ClientUser('client',
    {
        id: 'userID',
        username: 'first user'
    })
)
twoMentionData.set('secondUser',  
    new ClientUser('client',
    {
        id: 'userID',
        username: 'second user'
    }) 
)
 
const threeMentionData = new Collection()
threeMentionData.set('firstUser',  
    new ClientUser('client',
    {
        id: 'userID',
        username: 'first user'
    })
)
threeMentionData.set('secondUser',  
    new ClientUser('client',
    {
        id: 'userID',
        username: 'second user'
    }) 
)
threeMentionData.set('thirdUser',  
new ClientUser('client',
{
    id: 'userID',
    username: 'third user'
}) 
)

 
module.exports = {
    zeroMentions : {
        mentions : {
            users: zeroMentionData
        }
    },
    singleMention : {
        mentions : {
            users: singleMentionData
        },
    },
    twoMentions : {
        mentions: {
            users : twoMentionData
        }
        
    },
    threeMentions : {
       mentions:  {
            users : threeMentionData
        }
    } 
}

  

