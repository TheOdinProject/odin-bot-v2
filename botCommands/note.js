const { registerBotCommand } = require("../botEngine.js");

const noteDoc =
  "https://docs.google.com/document/d/1fas8xwMRi4GVrnCtp9U5OL7Y9QB6v5H_Wx19m4UQwgI/edit";

registerBotCommand(/\B\/notes?\b/, () => {
  `To note, or not to note, that is the question. Please read this: ${noteDoc}`;
});
