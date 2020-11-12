const config = require("../config.js");
const { registerBotCommand } = require("../botEngine.js");
registerBotCommand(/\B\/time\b/, async ({ room, mentions }) => {
    let users = '';
    const mentionedUsers = mentions.users.array()
    if (mentions.users.size >= 3){   
        mentionedUsers.forEach((user, index) => {
            return index < mentionedUsers.length - 1 ? users += ` ${user},` : users += ` and ${user}`
        })  
    } else if (mentions.users.size === 2) {
        mentionedUsers.forEach((user, index) => {
            return index < mentionedUsers.length - 1 ? users += ` ${user}` : users += ` and ${user}`
        })
    } else {
        users =  `, ${mentionedUsers[0]}`
    }
    return !users ? `Time is an illusion. Please read this: https://discord.com/channels/505093832157691914/505093832157691916/765633002393829389` : `Time is an illusion${users}. Please read this: https://discord.com/channels/505093832157691914/505093832157691916/765633002393829389`;
  });
  