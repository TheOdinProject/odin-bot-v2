const { EmbedBuilder } = require("discord.js");

class SpammerBanningService {
  static async handleInteraction(interaction) {
    const message = interaction.options.getMessage("message");
    if (message.author.bot) return;

    try {
      await SpammerBanningService.#sendMessageToUser(message.author);
    } catch (error) {
      console.log(error);
    }
  }

  static async #sendMessageToUser(user) {
    const embedMessage = new EmbedBuilder()
      .setTitle("Banned: Compromised account / Spam")
      .setDescription(
        `Account is compromised and is used to spam phishing links.

  If you would still like to continue using our server, make sure to change your password and recover your account.
  After that send a detailed contact information to appeal the ban on theodinprojectcontact@gmail.com`,
      );

    await user.send({ embeds: [embedMessage] });
  }
}

module.exports = SpammerBanningService;
