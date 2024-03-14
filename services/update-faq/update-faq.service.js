const { EmbedBuilder } = require('discord.js');
const config = require('../../config');

class UpdateFAQsService {
  static EmbedDescriptionCharacterLimit = 4096;

  static Delimiter = '###'

  static async handleInteraction(interaction) {
    let rawFAQs;
    try {
      rawFAQs = await UpdateFAQsService.fetchFAQs();
    } catch (error) {
      console.log(error);
      await interaction.reply('Failed to update FAQs');
      return;
    }

    const FAQEmbeds = UpdateFAQsService.createFAQEmbeds(rawFAQs);
    const FAQChannel = interaction.guild.channels.cache.get(config.channels.FAQChannelId);
    await UpdateFAQsService.deletePreviousFAQs(FAQChannel);
    await UpdateFAQsService.sendFAQs(FAQEmbeds, FAQChannel);
    await interaction.reply('FAQs updated');
  }

  static async fetchFAQs() {
    const response = await fetch('https://raw.githubusercontent.com/TheOdinProject/top-meta/main/FAQ.md');
    const FAQs = await response.text();
    return FAQs;
  }

  static createFAQEmbeds(rawFAQs) {
    return UpdateFAQsService
      .segments(rawFAQs, UpdateFAQsService.EmbedDescriptionCharacterLimit, UpdateFAQsService.Delimiter)
      .map((chunk) => new EmbedBuilder().setColor('#cc9543').setDescription(chunk));
  }

  static async sendFAQs(FAQEmbeds, FAQChannel) {
    await Promise.all(FAQEmbeds.map(async (e) => {
      await FAQChannel.send({ embeds: [e] });
    }));
  }

  static async deletePreviousFAQs(FAQChannel) {
    const prev = await FAQChannel.messages.fetch({ limit: 10 });
    prev.forEach((message) => message.delete());
  }

  static segments(string, length, delimiter, prependDelimiter = true) {
    const segmentedString = string.split(delimiter)
    const segments = []
    let currentSection = ""

    for (let i = 0; i < segmentedString.length; i += 1) {
      const segment = prependDelimiter ? delimiter + segmentedString[i] : segmentedString[i];

      if (segmentedString[i] === '') {
        // eslint-disable-next-line no-continue
        continue;
      }

      if ((currentSection.length + segment.length) >= length) {
        segments.push(currentSection);
        currentSection = segment;
      } else {
        currentSection += segment;
      }
    }

    segments.push(currentSection);
    return segments;
  }
}

module.exports = UpdateFAQsService;
