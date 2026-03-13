const { Events } = require('discord.js');
const SpammerKickService = require('../services/spam-kick');

module.exports = {
  name: Events.GuildMemberUpdate,
  execute: () => async (oldMemberState, newMemberState) => {
    await SpammerKickService.handleRoleUpdateEvent(
      oldMemberState,
      newMemberState,
    );
  },
};
