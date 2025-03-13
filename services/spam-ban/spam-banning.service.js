const { EmbedBuilder } = require('discord.js');
const { isAdmin } = require('../../utils/is-admin');
const config = require('../../config');

class SpamBanningService {
  static async handleInteraction(interaction) {
    const message = interaction.options.getMessage('message');

    try {
      if (message.author.bot || isAdmin(message.member)) {
        interaction.reply({
          content: 'You do not have the permission to ban this user',
          ephemeral: true,
        });
        return;
      }
      if (message.channelId !== config.channels.automodBlockChannelId) {
        interaction.reply({
          content:
            'This command can only be used in the automod block channel.',
          ephemeral: true,
        });
        return;
      }
      const reply = await SpamBanningService.#banUser(interaction);
      interaction.reply({ content: reply, ephemeral: true });
      await SpamBanningService.#announceBan(interaction, message);
    } catch (error) {
      console.error(error);
    }
  }

  static async #banUser(interaction) {
    const message = interaction.options.getMessage('message');
    const { guild } = interaction;
    let reply = `Successfully banned <@${message.author.id}> for spam.`;
    // Only attempt to send the message if message.author exists
    if (message.member) {
      try {
        await SpamBanningService.#sendMessageToUser(message.author);
      } catch (error) {
        reply = `Banned <@${message.author.id}> for spam but wasn't able to contact the user.`;
      }
    } else {
      reply = `Banned <@${message.author.id}> for spam but wasn't able to contact the user as they have left the server.`;
    }
    await guild.members.ban(message.author.id, {
      reason: 'Account is compromised',
    });
    message.react('✅');
    return reply;
  }

  static async #sendMessageToUser(author) {
    const embedMessage = new EmbedBuilder()
      .setTitle('Banned: Compromised account / Spam')
      .setDescription(
        `Your account has been banned from The Odin Project Discord server for sending spam. If this account is compromised, please follow the steps linked in this [Discord support article about securing your account](https://support.discord.com/hc/en-us/articles/24160905919511-My-Discord-Account-was-Hacked-or-Compromised).

Once your account is secure, you may appeal your ban by emailing \`moderation@theodinproject.com\` with the following template:

- Banned username:
- Reason for ban:
- Date of ban:
- Steps taken to secure my account:
- Additional comments (optional):

Please note that it may take at least several days for our volunteer staff to process your request.`,
      );

    await author.send({
      content:
        'Your account has been banned. Please enable embeds in Discord settings if you cannot see the message below.',
      embeds: [embedMessage],
    });
  }

  static async #announceBan(interaction, message) {
    const channelID = config.channels.moderationLogChannelId;
    const channel = await interaction.guild.channels.fetch(channelID);
    if (channel == null) {
      throw new Error(`No channel with the ID ${channelID} was found.`);
    }

    const embed = {
      timestamp: `${new Date().toISOString()}`,
      color: 15747399,
      footer: {
        text: `ID: ${message.author.id}`,
      },
      author: {
        name: `Ban | ${message.author.username}`,
        icon_url: `${message.author.displayAvatarURL()}`,
      },
      fields: [
        {
          value: `<@${message.author.id}>`,
          name: 'User',
          inline: true,
        },
        {
          value: `<@${interaction.user.id}>`,
          name: 'Moderator',
          inline: true,
        },
        {
          value: 'Account is compromised and spamming phishing links.',
          name: 'Reason',
          inline: true,
        },
      ],
    };

    channel.send({ embeds: [embed] });
  }
}

module.exports = SpamBanningService;
