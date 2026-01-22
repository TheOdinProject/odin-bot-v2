const testHelpers = require('./discordjs-test-helpers');
const addUserOptions = require('./add-subcommands');

module.exports = { ...testHelpers, ...addUserOptions };
