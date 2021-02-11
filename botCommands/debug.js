const { registerBotCommand } = require("../botEngine.js");

const command = {
  regex: /(?<!\S)\/debug(?!\S)/,
  cb: ({ content }) => {
    const query = content.match(/\B\/debug\s?(\S+)?/)[1];

    const template = `Based on the description of your problem, you can get to the root of it using a debugger. Learning how to track down problems like this is an inevitable part of being a developer.`;

    const defaultReply =
      template +
      `\n<https://en.wikipedia.org/wiki/Debugging>

To get a helpful resource in javascript or ruby, run \`/debug js\` or \`/debug rb\`.`;

    switch (query) {
      case "js":
        return (
          template +
          `\n<https://developers.google.com/web/tools/chrome-devtools/javascript>`
        );
      case "rb":
        return (
          template +
          `\n<https://www.theodinproject.com/courses/ruby-programming/lessons/debugging#debugging-with-pry-byebug>`
        );
      default:
        return defaultReply;
    }
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
