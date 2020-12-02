const { Collection, ClientUser } = require("discord.js")

const generateMentions = (number) =>{
	const collection = new Collection()
  for(let i = 0; i < number; i++){
	  collection.set(`User${i+1}`,
			new ClientUser ('client',
				{
					id: i + 1,
						username: `User${i+1}`
				})
		)
	}
	return {
		mentions : {
			users : collection
		}
	}
}

module.exports = generateMentions

