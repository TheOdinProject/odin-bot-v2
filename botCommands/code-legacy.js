const Discord = require("discord.js");
const { registerBotCommand } = require("../botEngine");

const code = {
  regex: /(?<!\S)!code(?!\S)/,
  cb: ({ mentions }) => {
    let users = "";
    if (mentions.users) {
      mentions.users.forEach((user) => {
        users += `<@${user.id}> `;
      });
    }

    const codeCommandEmbed = new Discord.EmbedBuilder()
      .setColor('#cc9543')
      .setTitle('How to share your code')
      .setDescription(`
**Codeblocks:**        

To write multiple lines of code with language syntax highlighting, use three [backticks](https://i.stack.imgur.com/ETTnT.jpg) followed by the language:

\\\`\\\`\\\`js
// your JavaScript code goes here
\\\`\\\`\\\`

**Inline code:**

For \`inline code\` use one backtick (no syntax highlighting):

\\\`code here!\\\`

**Websites:**

- [Code Sandbox](https://codesandbox.io/) for Webpack/React projects
- [Repl.it](https://replit.com/) for JavaScript/Ruby projects
- [Codepen](https://codepen.io/) for basic HTML/CSS/Javascript
      `
      );

    return { 
      content: users ? `${users.trim()}` : '',
      embeds: [codeCommandEmbed] 
    };
  },
};

registerBotCommand(code.regex, code.cb);

module.exports = {
  code,
};
