/**
 * We do not need to mock the actual Discord.js module with these features
 * as we are only unit testing individual callbacks, and just need
 * appropriate arguments/properties so that the callback can fetch/get the
 * appropriate values.
 *
 * We would only need to mock the actual Discord.js module with these
 * if we were to write integration tests.
 * However, this would be incredibly complex, requiring a lot of mocking
 * of Discord.js' internals like events, API calls etc.
 * Not worth it for the complexity and maintenance costs.
 *
 * Since these are just Discord internals, none of our callbacks should
 * need to instantiate any of these directly.
 */
const ODIN_BOT = require('./odin-bot');
const Client = require('./client');
const Guild = require('./guild');
const GuildMember = require('./guild-member');
const TextChannel = require('./text-channel');
const User = require('./user');

module.exports = {
  Client,
  Guild,
  GuildMember,
  TextChannel,
  User,
  ODIN_BOT,
};
