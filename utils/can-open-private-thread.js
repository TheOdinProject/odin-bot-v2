const { GuildPremiumTier } = require('discord.js');

function canOpenPrivateThread(tier) {
  return [GuildPremiumTier.Tier2, GuildPremiumTier.Tier3].includes(tier);
}

module.exports = canOpenPrivateThread;
