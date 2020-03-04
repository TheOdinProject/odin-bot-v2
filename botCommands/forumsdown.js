const {registerBotCommand} = require("../botEngine.js");

registerBotCommand(forum down|forums down, ({room}) => {
  return `
  **Hello! Yes, the forums are down!`;
});
