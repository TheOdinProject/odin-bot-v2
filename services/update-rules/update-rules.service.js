const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

class UpdateRulesService {
  static EmbedDescriptionCharacterLimit = 4096;

  // regex for [rule-name]: # (my rule name)
  static Delimiter = /(\[rule-name\]: # \(.+\))/;

  static async handleInteraction(interaction) {
    let rawRules;
    try {
      rawRules = await UpdateRulesService.fetchRules();
    } catch (error) {
      console.log(error);
      await interaction.reply("Failed to update rules");
      return;
    }

    const rulesEmbeds = UpdateRulesService.createRulesEmbeds(rawRules);
    const rulesChannel = interaction.guild.channels.cache.get(
      config.channels.rulesChannelId
    );
    await UpdateRulesService.deletePreviousRules(rulesChannel);
    await interaction.reply("i'm doing the thing, wait...");
    await UpdateRulesService.sendRules(rulesEmbeds, rulesChannel);
    await interaction.editReply("Rules updated");
  }

  static async fetchRules() {
    const response = await fetch(
      "https://raw.githubusercontent.com/TheOdinProject/top-meta/main/community-rules.md"
    );
    const rules = await response.text();
    return rules;
  }

  static createRulesEmbeds(rawRules) {
    return UpdateRulesService.segments(
      rawRules,
      UpdateRulesService.EmbedDescriptionCharacterLimit,
      UpdateRulesService.Delimiter
    ).map((chunk) =>
      new EmbedBuilder().setColor("#cc9543").setDescription(chunk)
    );
  }

  static async sendRules(rulesEmbeds, rulesChannel) {
    await Promise.all(
      rulesEmbeds.map(async (e) => {
        await rulesChannel.send({ embeds: [e] });
      })
    );
  }

  static async deletePreviousRules(rulesChannel) {
    // might need to increase limit if there are more than 20 messages
    const prev = await rulesChannel.messages.fetch({ limit: 20 });
    prev.forEach((message) => message.delete());
  }

  static segments(string, length, delimiter) {
    const segmentedString = string
      // for whatever reason, discord ain't parsing these emojis. fine i'll do it myself
      .replaceAll("&#9989;", "✅")
      .replaceAll("&#10060;", "❌")
      .split(delimiter)
      .filter((chunk) => !chunk.match(delimiter));

    for (let i = 0; i < segmentedString.length; i += 1) {
      if (segmentedString[i].length >= length) {
        segmentedString[i] = segmentedString[i].match(
          new RegExp(`.{1,${length}}`, "g")
        );
      }
    }
    return segmentedString.flat(Infinity);
  }
}

module.exports = UpdateRulesService;
