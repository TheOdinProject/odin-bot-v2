const { EmbedBuilder } = require('discord.js');
const config = require('../../config');

class UpdateFAQsService {
  static EmbedDescriptionCharacterLimit = 4096;

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
      .segments(rawFAQs, UpdateFAQsService.EmbedDescriptionCharacterLimit)
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

  static segments(string, length) {
    const segments = [];
    for (let i = 0; i < string.length; i += length) {
      segments.push(string.substring(i, i + length));
    }
    return segments;
  }
}

module.exports = UpdateFAQsService;
