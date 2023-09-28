const { registerBotCommand } = require('../botEngine');

const command = {
  regex: /\B!google\s+.+/,
  cb: ({ content }) => {
    const transform = (transformContent) => {
      const query = transformContent.split(' ').map(encodeURIComponent).join('+');
      return `**This query might help you find what you're looking for >** <https://google.com/search?q=${query}>`;
    };

    const query = content.match(/\B!google\s+(.+)/)[1];
    return `${transform(query)}`;
  },
};
registerBotCommand(command.regex, command.cb);

module.exports = command;