const {registerBotCommand} = require("../botEngine.js");

const command = {
    regex: /\B\/micro\b/,
    cb : ()=>{
        return `Microverse is using The Odin Project's licensed content without permission. Please read this: https://discord.com/channels/505093832157691914/505093832157691916/781170792095809547`
    }
}

registerBotCommand(command.regex, command.cb)