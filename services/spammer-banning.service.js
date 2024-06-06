const { EmbedBuilder } = require("discord.js");

class SpammerBanningService {
  static async handleInteraction(interaction) {
    const message = interaction.options.getMessage("message");
    if (message.author.bot) return;

    try {
      await SpammerBanningService.#banUser(interaction, message);
    } catch (error) {
      console.log(error);
    }
  }

  static async #banUser(interaction, message) {
    if (message.member) {
      // Make sure to send the message before banning otherwise user will not be found
      await SpammerBanningService.#sendMessageToUser(message.author);
      message.member.ban({ reason: "Account is compromised" });
      await SpammerBanningService.#announceBanningUser(
        interaction,
        message.author,
      );
    } else {
      await SpammerBanningService.#announceUserLeaving(
        interaction,
        message.author,
      );
    }

    message.react("✅");
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

  static async #announceBanningUser(interaction, author) {
    interaction.reply({
      content: `Banned <@${author.id}> for spam successfully.`,
    });
  }

  static async #announceUserLeaving(interaction, author) {
    interaction.reply({
      content: `Couldn't bann <@${author.id}>. User is not on the server.`,
    });
  }
}

module.exports = SpammerBanningService;
