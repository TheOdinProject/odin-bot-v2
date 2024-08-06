const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

class SpamBanningService {
  static async handleInteraction(interaction) {
    const message = interaction.options.getMessage("message");
    if (message.author.bot || SpamBanningService.#isAdmin(message.member)) {
      interaction.reply({
        content: "You do not have the permission to ban this user",
        ephemeral: true,
      });
      return;
    }

    try {
      let reply;

      if (!message.member) {
        message.react("❌");
        reply = `Couldn't bann <@${message.author.id}>. User is not on the server.`;
      } else {
        reply = await SpamBanningService.#banUser(message);
        await SpamBanningService.#announceBan(interaction, message);
      }

      interaction.reply({ content: reply, ephemeral: true });
    } catch (error) {
      console.error(error);
    }
  }

  static async #banUser(message) {
    let reply = `Banned <@${message.author.id}> for spam successfully.`;
    try {
      // Make sure to send the message before banning otherwise user will not be found
      await SpamBanningService.#sendMessageToUser(message.author);
    } catch (error) {
      reply = `Banned <@${message.author.id}> for spam but wasn't able to contact the user.`;
    }

    message.member.ban({ reason: "Account is compromised" });
    message.react("✅");
    return reply;
  }

  static async #sendMessageToUser(author) {
    const embedMessage = new EmbedBuilder()
      .setTitle("Banned: Compromised account / Spam")
      .setDescription(
        `Your account has been banned from The Odin Project Discord server for sending spam. If this account is compromised, please follow the steps linked in [this Discord support article](https://support.discord.com/hc/en-us/articles/24160905919511-My-Discord-Account-was-Hacked-or-Compromised) to secure your account.

Once your account is secure, you may appeal your ban by emailing \`theodinprojectcontact@gmail.com\` with your Discord username and that you are appealing your ban due to a compromised account.

Note: It may take several days for our volunteer staff to take action on your appeal, and unbanning is not guaranteed.`);

    await author.send({content: "Your account has been banned, Please enable the embed option if you cannot see the message bellow.", embeds: [embedMessage] });
  }

  static async #announceBan(interaction, message) {
    const channelID = config.channels.moderationLogChannelId;
    const channel = await interaction.guild.channels.fetch(channelID);
    if (channel == null) {
      throw new Error(`No channel of the ID ${channelID} were found.`);
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
          name: "User",
          inline: true,
        },
        {
          value: `<@${interaction.user.id}>`,
          name: "Moderator",
          inline: true,
        },
        {
          value: "Account is compromised and spamming phishing links.",
          name: "Reason",
          inline: true,
        },
      ],
    };

    channel.send({ embeds: [embed] });
  }

  static #isAdmin(member) {
    if (!member) {
      return false;
    }

    return member.roles.cache.some((role) =>
      config.roles.adminRolesName.includes(role.name),
    );
  }
}

module.exports = SpamBanningService;
