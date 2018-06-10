# ODIN BOTTTTTTTTTTTTTTTTTT

here lies the code that runs Odin's right hand bot... 

All of the bot's commands are found in the `botCommands` folder.  The code that listens to and runs the various commands can be found in `bot-engine.js`.  The Bot-Engine scans the entire botCommands directory and loads all .js files, so to create a new command all you have to do is either include it in one of the existing files, or create a new one.  New commands do not need to be exported but should be added with the `registerBotCommand()` function like so:

```javascript
const { registerBotCommand } = require("../bot-engine.js");

const commandFunc = function({data, text}) {
  // this function should return either a string or a promise that resolves a string.
  // the string that returns is what the bot will say
  return "Hi, I'm a bot lol";
}

registerBotCommand(/regex/, commandFunc);
```

The parameter of the command-function is an object that exposes data about the message that matches the regex.  `text` is simply the full text of the message. `data` has quite a bit of info in it, but likely the most useful is the username of the person that sent the message which you can access like so: `data.fromUser.username`.
