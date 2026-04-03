require('dotenv').config({ quiet: process.env.NODE_ENV === 'test' });

const config = {
  pointsbot: {
    token: process.env.POINTSBOT_TOKEN,
  },
  guildId: process.env.DISCORD_GUILD_ID,
  clientId: process.env.DISCORD_CLIENT_ID,
  token: process.env.DISCORD_API_KEY,
  channels: {
    noPointsChannelIds: process.env.NO_POINTS_CHANNEL_IDs
      ? process.env.NO_POINTS_CHANNEL_IDs.split(',')
      : ['513125912070455296', '948409662255026227'],
    introductionsChannelId:
      process.env.INTRODUCTIONS_CHANNEL_ID || '690618925494566912',
    gettingHiredChannelId:
      process.env.GETTING_HIRED_CHANNEL_ID || '669547324707569665',
    botSpamPlaygroundChannelId:
      process.env.BOT_SPAM_PLAYGROUND_CHANNEL_ID || '513125912070455296',
    FAQChannelId: process.env.FAQ_CHANNEL_ID || '823266307293839401',
    WSLChannelId: process.env.WSL_CHANNEL_ID || '1179839248803844117',
    ContactModeratorsChannelId:
      process.env.CONTACT_MODERATORS_CHANNEL_ID || '1059513837197459547',
    rulesChannelId: process.env.RULES_CHANNEL_ID || '693244715839127653',
    moderationLogChannelId:
      process.env.MODERATION_LOG_CHANNEL_ID || '922520585018433536',
    automodBlockChannelId:
      process.env.AUTOMOD_BLOCK_CHANNEL_ID || '902580242881859654',
  },
  roles: {
    NOBOTRoleId: '783764176178774036',
    adminRolesName: ['core', 'maintainer', 'admin', 'moderator'],
    backer: '1134874972339327087',
  },
  modmailUserId: '575252669443211264',
  color: '#cc9543',
};

module.exports = config;
