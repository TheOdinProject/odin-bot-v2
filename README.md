# ODIN BOTTTTTTTTTTTTTTTTTT

here lies the code that runs Odin's right hand bot... 

All of the bot's commands are found in the `botCommands` folder.  The code that listens to and runs the various commands can be found in `botEngine.js`.  The botEngine scans the entire botCommands directory and loads all .js files, so to create a new command all you have to do is either include it in one of the existing files, or create a new file with your command.  New commands should be exported for use in our test files. Commands should be added with the `registerBotCommand()` function like so:

```javascript
const { registerBotCommand } = require("../botEngine.js");

const command = {
  regex: /regex/,
  cb : ({content, author}) => {
  // this function should return either a string or a promise that resolves a string.
  // the string that returns is what the bot will say
  return "Hi, I'm a bot lol";
  } 
}

registerBotCommand(command.regex, command.cb);

module.exports = command
```

The parameter of the command-function is an object that exposes data about the message that matches the regex.  `content` is simply the full text of the message. `author` is the user object of the author of the message.. you can get the username with `author.username`. 

The documentation for Discord.JS can be found [here](https://discord.js.org/#/docs/main/stable/general/welcome).


