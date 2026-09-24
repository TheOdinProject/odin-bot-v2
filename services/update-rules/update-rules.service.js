const { EmbedBuilder, MessageFlags } = require('discord.js');
const config = require('../../config');
const extraMessages = require('./rules-extras');

class UpdateRulesService {
  static RulesUrl = 'https://www.theodinproject.com/guides/community/rules';

  // matches the `[rule-name]: # (my-rule-name)` markdown comments that precede each rule,
  // capturing the rule name, which is also the rule's anchor on the website
  static RuleNameDelimiter = /\[rule-name\]: # \((.+)\)/;

  static async handleInteraction(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    let rawRules;
    try {
      rawRules = await UpdateRulesService.fetchRules();
    } catch (error) {
      console.log(error);
      await interaction.editReply('Failed to update rules');
      return;
    }

    const rulesEmbeds = UpdateRulesService.createRulesEmbeds(rawRules);
    const rulesChannel = interaction.guild.channels.cache.get(
      config.channels.rulesChannelId,
    );
    await UpdateRulesService.deletePreviousRules(rulesChannel);
    await UpdateRulesService.sendRules(rulesEmbeds, rulesChannel);
    await interaction.editReply('Rules updated');
  }

  static async fetchRules() {
    const response = await fetch(
      'https://raw.githubusercontent.com/TheOdinProject/top-meta/main/community-rules.md',
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch rules: ${response.status}`);
    }
    const rules = await response.text();
    return rules;
  }

  // one embed for the intro and one per rule, with each rule's heading linking to that rule on the website
  static createRulesEmbeds(rawRules) {
    const [intro, ...rules] = UpdateRulesService.decodeHtmlEntities(
      rawRules,
    ).split(UpdateRulesService.RuleNameDelimiter);

    // the intro's heading links to the rules page itself
    const sections = [
      {
        ...UpdateRulesService.parseSection(intro),
        url: UpdateRulesService.RulesUrl,
      },
    ];
    for (let i = 0; i < rules.length; i += 2) {
      sections.push({
        ...UpdateRulesService.parseSection(rules[i + 1]),
        url: `${UpdateRulesService.RulesUrl}#${rules[i]}`,
      });
    }

    return sections.map(({ title, description, url }) =>
      new EmbedBuilder()
        .setColor('#e2b260')
        .setTitle(title)
        .setURL(url)
        .setDescription(description),
    );
  }

  // uses the first line's heading as the title and the rest as the description
  static parseSection(markdown) {
    const [heading, ...body] = markdown.trim().split('\n');
    return {
      title: heading.replace(/^#+ /, ''),
      description: body.join('\n').trim() || null,
    };
  }

  // Discord doesn't render numeric HTML entities such as `&#9989;` (✅)
  static decodeHtmlEntities(string) {
    return string.replace(/&#(\d+);/g, (_, codePoint) =>
      String.fromCodePoint(Number(codePoint)),
    );
  }

  static async sendRules(rulesEmbeds, rulesChannel) {
    const messages = [
      ...rulesEmbeds.map((e) => ({ embeds: [e] })),
      ...extraMessages,
    ];
    await Promise.all(
      messages.map(async (message) => {
        await rulesChannel.send(message);
      }),
    );
  }

  static async deletePreviousRules(rulesChannel) {
    const prev = await rulesChannel.messages.fetch({ limit: 100 });
    await Promise.all(prev.map((message) => message.delete()));
  }
}

module.exports = UpdateRulesService;
