const { EmbedBuilder } = require("discord.js");

class SpammerBanningService {
  static async handleInteraction(interaction) {
    const message = interaction.options.getMessage("message");
    console.log(message);
    if (message.author.bot) return;
    const messageEmbed = await SpammerBanningService.#messageBuilder(message);

    try {
      await SpammerBanningService.#sendMessageToUser(message.author, {
        embeds: [messageEmbed],
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async #sendMessageToUser(user, message) {
    await user.send(message);
  }

  static async #messageBuilder(message) {
    return new EmbedBuilder()
      .setTitle("Banned: Compromised account / Spam")
      .setDescription(
        `
      Hi <@${message.author.id}>, Your account has been banned because it is posting phishing links in our server.
If you would still like to continue using our server, make sure to change your password and recover your account.
After that send a detailed contact information to appeal the ban on theodinproject@gmail.com`,
      );
  }
}

module.exports = SpammerBanningService;
