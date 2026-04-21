const config = require('../../config');
const { isAdmin } = require('../../utils/is-admin');

class SpamKickingService {
  static async kick(member) {
    try {
      if (isAdmin(member)) {
        console.error(new Error(`Bot attempting to Kick an admin user.`));
        return;
      }
      // User has to be informed before the kick happens
      await SpamKickingService.#informUser(member);
      await SpamKickingService.#logKick(member);
      await member.kick(
        'Attachments spam, account flagged for being compromised',
      );
    } catch (e) {
      console.error(e);
    }
  }

  static async #logKick(member) {
    const channelID = config.channels.moderationLogChannelId;
    const channel = await member.guild.channels.fetch(channelID);
    if (channel == null) {
      throw new Error(`No channel with the ID ${channelID} was found.`);
    }

    const embed = {
      timestamp: `${new Date().toISOString()}`,
      color: 15747399,
      footer: {
        text: `ID: ${member.id}`,
      },
      author: {
        name: `Kick | ${member.user.username}`,
        icon_url: `${member.displayAvatarURL()}`,
      },
      fields: [
        {
          value: `<@${member.id}>`,
          name: 'User',
          inline: true,
        },
        {
          value:
            'User has been kicked for posting more than 4 attachments in a single message.',
          name: 'Reason',
          inline: true,
        },
      ],
    };

    channel.send({ embeds: [embed] });
  }

  static async #informUser(member) {
    try {
      await member.send(
        `You have been kicked from the Odin Project Discord server for sending multiple attachments in short session. If this account is compromised, please follow the steps linked in this [Discord support article about securing your account](https://support.discord.com/hc/en-us/articles/24160905919511-My-Discord-Account-was-Hacked-or-Compromised). Once your account is secure, feel free to rejoin the server`,
      );
      // If user has DMs disabled, ignore the error
      // eslint-disable-next-line no-empty
    } catch {}
  }
}

module.exports = SpamKickingService;
