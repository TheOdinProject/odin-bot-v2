const { color } = require('../config');

const commandContents = {
  code: {
    color,
    title: 'How to share your code',
    description: `
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
`,
  },
  os: {
    color,
    title: 'Windows',
    description: `**The Odin Project does not support Windows or any other OS outside of our recommendations**. We are happy to assist with any questions about installing a VM, using WSL, or dual booting Linux.

For more info on Windows, check out this exhaustive list on [why we do not support Windows](<https://github.com/TheOdinProject/blog/wiki/Why-We-Do-Not-Support-Windows>).

<https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/installation-overview#os-options>
`,
    url: 'https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/installation-overview#os-options',
  },
  question: {
    color,
    title: 'Asking Great Questions',
    description: `
Asking context-rich questions makes it easy to receive help, and makes it easy for others to help you quickly! Great engineers ask great questions, and the prompt below is an invitation to improve your skills and set yourself up for success in the workplace.

**Project/Exercise:**
**Lesson link:**
**Code:** [code sandbox like replit or codepen]
**Issue/Problem:** [screenshots if applicable]
**What I expected:**
**What I've tried:**

For even more context around on how to hone your question-asking skills, give this a read: https://www.theodinproject.com/guides/community/how_to_ask
        `,
  },
  top: {
    color,
    title: 'The Odin Project',
    description:
      'For more information about The Odin Project, visit our site:\n[Your Career in Web Development Starts Here](https://www.theodinproject.com/)',
  },
  wsl: {
    color,
    title: 'WSL',
    description:
      'For help with using WSL please use the WSL channel: <#1179839248803844117>',
  },
  xy: {
    color,
    title: 'This could very well be an xy problem',
    description:
      'What problem are you *really* trying to solve? Check out [this article about xy problems](https://xyproblem.info/) to help others better understand your question.',
  },
};

module.exports = commandContents;
