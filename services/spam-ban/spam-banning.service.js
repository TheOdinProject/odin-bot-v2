const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

class SpamBanningService {
  static async handleInteraction(interaction) {
    const message = interaction.options.getMessage("message");
    if (message.author.bot || SpamBanningService.#isAdmin(message.member)) {
      interaction.reply({
        content: "You do not have the permission to ban this user",
      });
      return;
    }

    try {
      let reply;

      if (!message.member) {
        message.react("❌");
        reply = {
          content: `Couldn't bann <@${message.author.id}>. User is not on the server.`,
        };
      } else {
        reply = await SpamBanningService.#banUser(message);
        await SpamBanningService.#announceBan(interaction, message);
      }

      interaction.reply(reply);
    } catch (error) {
      console.error(error);
    }
  }

  static async #banUser(message) {
    // Make sure to send the message before banning otherwise user will not be found
    let reply = `Banned <@${message.author.id}> for spam successfully.`;
    try {
      await SpamBanningService.#sendMessageToUser(message.author);
    } catch (error) {
      reply = `Banned <@${message.author.id}> for spam but wasn't able to contact the user.`;
    }

    message.member.ban({ reason: "Account is compromised" });
    message.react("✅");
    return { content: reply };
  }

  static async #sendMessageToUser(author) {
    const embedMessage = new EmbedBuilder()
      .setTitle("Banned: Compromised account / Spam")
      .setDescription(
        `Account is compromised and is used to spam phishing links.

  If you would still like to continue using our server, make sure to change your password and recover your account.
  After that send a detailed contact information to appeal the ban on theodinprojectcontact@gmail.com`,
      );

    await author.send({ embeds: [embedMessage] });
  }

  static async #announceBan(interaction, message) {
    const embed = {
      timestamp: `${new Date().toISOString()}`,
      color: 15747399,
      footer: {
        text: `ID: ${interaction.id}`,
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

    const channelID = config.channels.moderationLog;
    const channel = interaction.guild.channels.cache.find(
      (c) => c.id === channelID,
    );

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
