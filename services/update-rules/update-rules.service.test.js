const UpdateRulesService = require('./update-rules.service');

const rawRules = `## Community Rules

Intro to the rules.

### &#9989; Do
- Be nice

[rule-name]: # (safe-topics)

### Discuss topics that are safe
&#9989; Discuss safe topics.

&#10060; Do not discuss unsafe topics.

[rule-name]: # (respect)

### Act professionally
&#9989; Be respectful.
`;

describe('UpdateRulesService', () => {
  describe('decodeHtmlEntities', () => {
    it('decodes numeric HTML entities into their characters', () => {
      expect(
        UpdateRulesService.decodeHtmlEntities('&#9989; Do &#10060; Do not'),
      ).toBe('✅ Do ❌ Do not');
    });
  });

  describe('createRulesEmbeds', () => {
    it('creates one embed for the intro and one per rule, linking each to the website', () => {
      const embeds = UpdateRulesService.createRulesEmbeds(rawRules);
      expect(embeds.map((embed) => embed.data)).toEqual([
        {
          color: 0xcc9543,
          title: 'Community Rules',
          url: 'https://www.theodinproject.com/guides/community/rules',
          description: 'Intro to the rules.\n\n### ✅ Do\n- Be nice',
        },
        {
          color: 0xcc9543,
          title: 'Discuss topics that are safe',
          url: 'https://www.theodinproject.com/guides/community/rules#safe-topics',
          description:
            '✅ Discuss safe topics.\n\n❌ Do not discuss unsafe topics.',
        },
        {
          color: 0xcc9543,
          title: 'Act professionally',
          url: 'https://www.theodinproject.com/guides/community/rules#respect',
          description: '✅ Be respectful.',
        },
      ]);
    });
  });
});
