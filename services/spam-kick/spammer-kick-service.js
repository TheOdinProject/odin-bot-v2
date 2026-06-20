const config = require('../../config');
const { isAdmin } = require('../../utils/is-admin');

class SpamKickingService {
  static ATTACHMENT_LIMIT = 1;

  static async kick(member, size, content) {
    try {
      if (isAdmin(member)) {
        console.error(new Error(`Bot attempting to Kick an admin user.`));
        return;
      }
      await SpamKickingService.#dmUser(
        member,
        `You have been kicked from the Odin Project Discord server for ${size} attachments in short succession. If this account is compromised, please follow the steps linked in this [Discord support article about securing your account](https://support.discord.com/hc/en-us/articles/24160905919511-My-Discord-Account-was-Hacked-or-Compromised). Once your account is secure, feel free to rejoin the server.\nThe message that was deleted was:`,
      );
      await SpamKickingService.#dmDeletedMessage(member, content);
      await SpamKickingService.#logAction(member, {
        action: 'Kick',
        color: 15747399,
        reason: `User has been kicked for posting ${size} attachments in a single message repeatedly. The limit is currently ${SpamKickingService.ATTACHMENT_LIMIT}.`,
      });
      await member.kick(
        'Attachments spam, account flagged for being compromised',
      );
    } catch (e) {
      console.error(e);
    }
  }

  static async warn(member, size, content) {
    try {
      if (isAdmin(member)) {
        console.error(new Error(`Bot attempting to warn an admin user.`));
        return;
      }
      await SpamKickingService.#dmUser(
        member,
        `You have been warned in the Odin Project Discord server for sending ${size} attachments in a single message. The current limit is ${SpamKickingService.ATTACHMENT_LIMIT}. If you do this again, you will be kicked. If your account has been compromised, please follow the steps in this [Discord support article about securing your account](https://support.discord.com/hc/en-us/articles/24160905919511-My-Discord-Account-was-Hacked-or-Compromised).\nThe message that was deleted was:`,
      );
      await SpamKickingService.#dmDeletedMessage(member, content);
      await SpamKickingService.#logAction(member, {
        action: 'Warning',
        color: 16776960,
        reason: `User has been warned for posting ${size} attachments single message. The limit is currently ${SpamKickingService.ATTACHMENT_LIMIT}. Next offense will result in a kick.`,
      });
    } catch (e) {
      console.error(e);
    }
  }

  static async #dmDeletedMessage(member, content) {
    const MESSAGE_CHAR_LIMIT = 2000;
    for (let i = 0; i < content.length; i += MESSAGE_CHAR_LIMIT) {
      SpamKickingService.#dmUser(
        member,
        content.slice(i, i + MESSAGE_CHAR_LIMIT),
      );
    }
  }

  static async #logAction(member, { action, color, reason }) {
    const channelID = config.channels.moderationLogChannelId;
    const channel = await member.guild.channels.fetch(channelID);
    if (channel == null) {
      throw new Error(`No channel with the ID ${channelID} was found.`);
    }

    const embed = {
      timestamp: `${new Date().toISOString()}`,
      color,
      footer: {
        text: `ID: ${member.id}`,
      },
      author: {
        name: `${action} | ${member.user.username}`,
        icon_url: `${member.displayAvatarURL()}`,
      },
      fields: [
        {
          value: `<@${member.id}>`,
          name: 'User',
          inline: true,
        },
        {
          value: reason,
          name: 'Reason',
          inline: true,
        },
      ],
    };

    channel.send({ embeds: [embed] });
  }

  static async #dmUser(member, message) {
    try {
      await member.send(message);
    } catch (error) {
      await SpamKickingService.#logAction(member, {
        action: 'Failure',
        color: 15747399,
        reason: `Unable to deliver DM to user: ${error.message}`,
      });
    }
  }
}

module.exports = SpamKickingService;
