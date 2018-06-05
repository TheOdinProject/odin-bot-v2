const { registerBotCommand } = require("../bot-engine.js");

registerBotCommand(/\/[shurg]{5}/, ({ text }) => {
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  const shurgalurg = text.match(/[shurg]{5}/)[0];
  // return early if all chars are not unique
  if (text.match(/[shurg]{5}/)[0].split("").filter(onlyUnique).length !== 5) {
    return;
  }

  const parts = {
    s: `¯\\\\\\`,
    h: `_(`,
    r: `ツ`,
    u: `)_`,
    g: `/¯`
  };
  return shurgalurg
    .split("")
    .map(ch => parts[ch])
    .join("");
});
