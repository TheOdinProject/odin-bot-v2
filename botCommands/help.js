const {registerBotCommand} = require("../botEngine.js");

registerBotCommand(/\B\/help\b/, ({room}) => {
  return `
  **By posting in this chatroom you agree to our code of conduct:** <https://github.com/TheOdinProject/theodinproject/blob/master/doc/code_of_conduct.md>

Give points to someone who has been helpful by mentioning their name and adding ++ : \`@username ++\` or by giving them a star : \`@username :star:\`

View the points leaderboard with \`/leaderboard\`
Modify it with \`n=\` and \`start=\` i.e. \`/leaderboard n=25 start=30\`

Type \`/help\` to view this message again

Motivate your fellow odinites with \`/motivate\` and mention them

** The Odin Project Forums currently down as of 3/1/2020 **

I'm open source!  Hack me HERE: <https://github.com/codyloyd/odin-bot-v2>`;
});
registerBotCommand(/\B\/code\b/, ({room}) => {
  return `
**HOW TO EMBED CODE SNIPPETS**
To write multiple lines of code use three backticks <https://i.stack.imgur.com/ETTnT.jpg> (on their own line, \`shift + enter\` makes new lines):

\\\`\\\`\\\`
    [Put your Code here!]
\\\`\\\`\\\`

For \`inline code\` use one backtick:

\\\`Code here!\\\``;
});
