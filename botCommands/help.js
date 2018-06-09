const { registerBotCommand } = require("../bot-engine.js");

registerBotCommand(/\/help\b/, ({ room }) => {
  return `> #Odin-Bot Commands
    > - **By posting in this chatroom you agree to our [code of conduct](https://github.com/TheOdinProject/theodinproject/blob/master/doc/code_of_conduct.md)**
    > - give points to someone who has been helpful by mentioning their name and adding ++ : \`@username ++\` or by giving them a star : \`@username :star:\`
    > - view the points leaderboard with \`/leaderboard\`
    > - To view or join the rest of the Odin chatrooms click [HERE](https://gitter.im/orgs/TheOdinProject/rooms).
    > - share a nice gif with your friends with \`/giphy\` and another word
    > - For help with gitter commands (and \`code\` syntax) press \`ctl+shift+alt+m\`
    > - Type \`/help\` to view this message again
    > - motivate your fellow odinites with \`/motivate\` and mention them
    > - I'm open source!  Hack me [HERE](https://github.com/codyloyd/odin-bot-v2)!`;
});

registerBotCommand(/\/code\s|\/code$/, ({ room }) => {
  return `> #Composing Code Snippets
    > To write multiple lines of code use three [backticks](https://i.stack.imgur.com/ETTnT.jpg) (on their own line):
    > \\\`\\\`\\\`
    > [Put your Code here!]
    > \\\`\\\`\\\`
    > For \`inline code\` use one backtick:
    >\\\`Code here!\\\``;
});
