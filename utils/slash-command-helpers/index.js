const testHelpers = require("./discordjsTestHelpers");
const addUserOptions = require("./addSubcommands");

module.exports = { ...testHelpers, ...addUserOptions };
