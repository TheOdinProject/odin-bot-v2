const { registerBotCommand } = require("../botEngine.js");

const command = {
  regex: /(?<![\w`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])\/note(?![\w`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~)])/,
  cb: () => { 
    return `To note, or not to note, that is the question. Please read this: https://docs.google.com/document/d/1fas8xwMRi4GVrnCtp9U5OL7Y9QB6v5H_Wx19m4UQwgI/edit`;
  },
};

registerBotCommand(command.regex, command.cb);

module.exports = command;