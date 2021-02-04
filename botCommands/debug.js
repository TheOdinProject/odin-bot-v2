const { registerBotCommand } = require("../botEngine.js");

const command = {
  regex: /(?<!\S)\/debug(?!\S)/,
  cb: () =>
    `Looks like this problem can be solved using a debugger: <https://developers.google.com/web/tools/chrome-devtools/javascript>`,
};

registerBotCommand(command.regex, command.cb);

module.exports = command;
