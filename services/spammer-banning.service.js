const { EmbedBuilder } = require("discord.js");

class SpammerBanningService {
  static async handleInteraction(interaction) {
    const message = interaction.options.getMessage("message");
    if (message.author.bot) return;

    try {
      const reply = await SpammerBanningService.#handleBanning(message);
      interaction.reply(reply);
    } catch (error) {
      console.error(error);
    }
  }

  static async #handleBanning(message) {
    if (message.member) {
      return SpammerBanningService.#banUser(message);
    }

    message.react("❌");
    return {
      content: `Couldn't bann <@${message.author.id}>. User is not on the server.`,
    };
  }

  static async #banUser(message) {
    // Make sure to send the message before banning otherwise user will not be found
    let reply = `Banned <@${message.author.id}> for spam successfully.`;
    try {
      await SpammerBanningService.#sendMessageToUser(message.author);
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
}

module.exports = SpammerBanningService;
