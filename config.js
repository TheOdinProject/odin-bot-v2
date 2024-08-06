require('dotenv').config();

const config = {
  pointsbot: {
    token: process.env.POINTSBOT_TOKEN,
  },
  guildId: process.env.DISCORD_GUILD_ID,
  clientId: process.env.DISCORD_CLIENT_ID,
  token: process.env.DISCORD_API_KEY,
  channels: {
    noPointsChannelIds: ['513125912070455296', '948409662255026227'],
    introductionsChannelId: '690618925494566912',
    gettingHiredChannelId: '669547324707569665',
    botSpamPlaygroundChannelId: '513125912070455296',
    FAQChannelId: '823266307293839401',
    WSLChannelId: '1179839248803844117',
    ContactModeratorsChannelId: '1059513837197459547',
    rulesChannelId: '693244715839127653',
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
