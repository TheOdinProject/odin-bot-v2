// Discord-only messages that /updaterules posts, in order, after the rules from top-meta's community-rules.md
// Each entry is passed straight to channel.send, so it can be a string for a plain text message,
// or an object such as { embeds: [...] }
const { EmbedBuilder } = require('discord.js');
const { modmailUserId } = require('../../config');

const modmail = `<@${modmailUserId}>`;

const extraMessages = [
  {
    embeds: [
      new EmbedBuilder()
        .setColor('#e2b260')
        .setTitle('Additional Community Expectations')
        .setURL('https://www.theodinproject.com/guides/community/expectations')
        .setDescription(
          `Please read our additional community expectations because it contains additional tips that improve the quality of our community.

Our Core, Maintainer and Moderation team are also subject to the rules. If you see any of our team members have inappropriate behavior, please report it to ${modmail} with a link to the post and brief explanation of the rule that has been broken. Please do not argue publicly, instead communicate privately through ${modmail}.

Please note that the entire TOP team has visibility on ModMail. If it makes you more comfortable, you may DM one member of the team with your concerns, or email the core team at theodinprojectcontact@gmail.com.`,
        ),
    ],
  },

  // for anyone with embeds turned off
  `If you are unable to see the above rules, you can either turn on "Show embed and preview website links pasted into chat" or view them online: https://www.theodinproject.com/guides/community/rules`,
];

module.exports = extraMessages;
