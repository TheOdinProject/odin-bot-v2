require('dotenv').config({ quiet: process.env.NODE_ENV === 'test' });

const config = {
  pointsbot: {
    token: process.env.POINTSBOT_TOKEN,
  },
  guildId: process.env.DISCORD_GUILD_ID,
  clientId: process.env.DISCORD_CLIENT_ID,
  token: process.env.DISCORD_API_KEY,

  channels: {
    club40: {
      name: 'club-40',
      id: process.env.CLUB_40_CHANNEL_ID || '707225752608964628',
    },

    botSpamPlayground: {
      name: 'bot-spam-playground',
      id: process.env.BOT_SPAM_PLAYGROUND_CHANNEL_ID || '513125912070455296',
    },

    introductions: {
      name: 'introductions',
      id: process.env.INTRODUCTIONS_CHANNEL_ID || '690618925494566912',
    },

    gettingHired: {
      name: 'getting-hired',
      id: process.env.GETTING_HIRED_CHANNEL_ID || '669547324707569665',
    },

    faq: {
      name: 'faq',
      id: process.env.FAQ_CHANNEL_ID || '823266307293839401',
    },

    wslHelp: {
      name: 'wsl-help',
      id: process.env.WSL_CHANNEL_ID || '1179839248803844117',
    },

    contactModerators: {
      name: 'contact-moderators',
      id: process.env.CONTACT_MODERATORS_CHANNEL_ID || '1059513837197459547',
    },

    rules: {
      name: 'rules',
      id: process.env.RULES_CHANNEL_ID || '693244715839127653',
    },

    moderationLog: {
      name: 'moderation-log',
      id: process.env.MODERATION_LOG_CHANNEL_ID || '922520585018433536',
    },

    automodBlock: {
      name: 'automod-block',
      id: process.env.AUTOMOD_BLOCK_CHANNEL_ID || '902580242881859654',
    },
  },

  roles: {
    backer: {
      name: 'backer',
      id: process.env.BACKER_ROLE_ID || '1134874972339327087',
    },

    core: {
      name: 'core',
      id: process.env.CORE_ROLE_ID || '704888900124016771',
    },

    maintainer: {
      name: 'maintainer',
      id: process.env.MAINTAINER_ROLE_ID || '505094421583233024',
    },

    admin: {
      name: 'admin',
      id: process.env.ADMIN_ROLE_ID || '692407258667155586',
    },

    moderator: {
      name: 'moderator',
      id: process.env.MODERATOR_ROLE_ID || '892167320695361567',
    },

    nobot: {
      name: 'NOBOT',
      id: process.env.NOBOT_ROLE_ID || '783764176178774036',
    },

    club40: {
      name: 'club-40',
      id: process.env.CLUB40_ROLE_ID || '707225790546444288',
    },
  },

  users: {
    modmail: {
      name: 'ModMail',
      id: process.env.MOD_MAIL_USER_ID || '575252669443211264',
    },

    odinBot: {
      name: 'odin-bot',
      id: process.env.ODIN_BOT_USER_ID || '513097121482932253',
    },
  },
  color: '#cc9543',
};

module.exports = config;
