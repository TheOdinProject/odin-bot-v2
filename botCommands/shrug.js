const { registerBotCommand } = require("../bot-engine.js");

registerBotCommand(/\/[shurg]{5}/, ({ text }) => {
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  // return early if all chars are not unique
  if (text.split("").filter(onlyUnique).length !== 6) {
    return;
  }

  const parts = {
    s: `¯\\\\\\`,
    h: `_(`,
    r: `ツ`,
    u: `)_`,
    g: `/¯`
  };
  return text
    .split("")
    .map(ch => parts[ch])
    .join("");
});
