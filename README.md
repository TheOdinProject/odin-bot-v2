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

## Testing

All bot commands must be tested. For each command file you create, you will also need to create a `command.test.js` file. 

Each spec file will need to test for the regex and the callback using the following format: 

```
const command = require('./command')

describe('/commandname', () => {
  describe('regex', () => {
    /* Jest requires an array of arrays (also called a table) to be passed in so we may test each string with the same case */
    For more information: https://jestjs.io/docs/en/api#testeachtablename-fn-timeout */
    it.each([
      ['/string'],
      [' /string'],
      ['/string @odin-bot'],
      ['@odin-bot /string'],
    ])('correct strings trigger the callback', (string) => {
      expect(command.regex.test(string)).toBeTruthy()
    })
    
    it.each([
     /* incorrect variations of the string such as typos, mispellings, similar words, etc in the same formatting as the above */
    ])("'%s' does not trigger the callback", (string) => {
      expect(command.regex.test(string)).toBeFalsy()
    })

    // We also want to check to see if commands can be called from anywhere in a message
    it.each([
      ['Check this out! /string'],
      ['Don\'t worry about /string'],
      ['Hey @odin-bot, /string'],
      ['/@odin-bot ^ /me /time /string$*']
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(command.regex.test(string)).toBeTruthy()
    })

    it.each([
      ['@user/string'],
      ['it\'s about/string'],
      ['/stringsanillusion'],
      ['/string/'],
      ['/string*'],
      ['/string...']
    ])("'%s' - command should be its own word/group - no leading or trailing characters", (string) => {
      expect(command.regex.test(string)).toBeFalsy()
    })
  })

  describe('callback', () => {
    it('returns correct output', () => {
      expect(command.cb()).toMatchSnapshot()
    })
  })
})

```

Once you have filled out your test suite, run `npm test` to ensure all tests for your command pass and a snapshot is generated in the `__snapshots__` directory. Once you have confirmed that your snapshot matches the correct output, you may submit a pull request for review. 

If your particular command requires mentions to be passed into the callback, you may use the `generateMentions` helper located inside of `mockData.js`, which dynamically creates Discord User objects for you to leverage in your tests.

