const { GuildPremiumTier } = require('discord-api-types/v10');

function canOpenPrivateThread(tier) {
  return [GuildPremiumTier.Tier2, GuildPremiumTier.Tier3].includes(tier);
}

module.exports = canOpenPrivateThread;
