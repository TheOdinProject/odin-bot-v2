const PointsService = require('../../services/points');

const userRegex = '<@!?(\\d+)>';
// Don't disallow word chars after :star: - this should be perfectly valid: "@odinbot ⭐thanks!"
const starRegex = '\u{2b50}';
// matches at least two plus signs
const plusRegex = '(\\+){2,}';
const doublePointsPlusRegex = '\\?(\\+){2,}';
// Word chars disallowed after ++-based points chars to prevent awarding points if a user pings someone
// to ask about pre-increment syntax, e.g. "hey @odinbot ++i increments then evaluates, right?"
// but will still allow stuff like punctuation e.g. "thanks @odinbot ++!"
const plusBasedRegex = `(${plusRegex}|${doublePointsPlusRegex})(?!\\w)`;

// https://regexr.com/8gd0p to test this regex
//
// Ensure the user mention is not escaped or encased directly in an inline code block
// Not so simple to detect and prevent user mentions deeper within an inline or fenced code block though
// But this is mostly prevented by Discord escaping user mentions when typing in them, so they won't match userRegex
// Still technically possible by manually pasting something like <@!123456789> ++ in a code block (though it always was)
const awardPointsRegex = new RegExp(
  `(?<!\\\\|\`)${userRegex}\\s*(${plusBasedRegex}|${starRegex})`,
  'gu',
);

const awardPoints = {
  name: 'award points',
  regex: awardPointsRegex,
  cb: async function pointsBotCommand({ content, channel, guild, member }) {
    const awards = Array.from(
      content.matchAll(awardPointsRegex),
      ([_, userId, awardType]) => ({
        userId,
        points: awardType === '?++' ? 2 : 1,
      }),
    );

    channel.send(
      await PointsService.award({ giver: member, channel, guild, awards }),
    );
  },
};

module.exports = awardPoints;
